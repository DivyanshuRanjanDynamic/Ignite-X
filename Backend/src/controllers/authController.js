import database from '../config/database.js';
import logger from '../config/logger.js';
import jwtUtil from '../utils/jwt.js';
import passwordUtil from '../utils/password.js';
import config from '../config/env.js';
import uploadService from '../services/uploadService.js';
import botProtectionService from '../services/botProtectionService.js';
// Admin authentication now works directly with database-stored admin accounts

class AuthController {
  /**
   * Student Registration (4-step form from frontend)
   * POST /api/v1/auth/register/student
   */
  async studentRegister(req, res) {
    try {
      const {
        // Step 1: Personal Details
        name,
        email,
        phone,
        dateOfBirth,
        gender,
        
        // Step 2: Education & Skills
        education,
        degree,
        institution,
        graduationYear,
        domain,
        skills,
        experience,
        
        // Step 3: Location & Interests
        state,
        city,
        interests,
        workPreference,
        
        // Step 4: Security
        password,
        confirmPassword,
        
        // Bot Protection Data
        botProtection
      } = req.body;

      // Defensive normalization in case upstream parsing left strings
      const toArray = (input) => {
        if (input === undefined || input === null) return [];
        if (Array.isArray(input)) return input;
        if (typeof input === 'string') {
          const raw = input.trim();
          if (raw.length === 0) return [];
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
          } catch (e) {}
          const sanitized = raw.replace(/^\[|\]$/g, '');
          return sanitized.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
        }
        return [String(input)];
      };

      const normalizedSkills = toArray(skills);
      const normalizedInterests = toArray(interests);

      let normalizedGender = gender;
      if (normalizedGender !== undefined && normalizedGender !== null && normalizedGender !== '') {
        const gv = String(normalizedGender).trim().toLowerCase();
        if (gv === 'male') normalizedGender = 'MALE';
        else if (gv === 'female') normalizedGender = 'FEMALE';
        else if (gv === 'other') normalizedGender = 'OTHER';
        else if (['prefernottosay','prefer_not_to_say','prefer-not-to-say','prefer not to say'].includes(gv)) normalizedGender = 'PREFER_NOT_TO_SAY';
      }

      logger.info('Student registration attempt', {
        email,
        name,
        phone,
        ip: req.ip,
      });

      // Perform bot protection checks
      const botCheckResult = await botProtectionService.performBotProtectionCheck(req, {
        ...req.body,
        captchaToken: botProtection?.captchaToken
      });

      // Log bot protection result
      logger.info('Bot protection check result', {
        email,
        isBot: botCheckResult.isBot,
        confidence: botCheckResult.confidence,
        reason: botCheckResult.reason,
        suspicionScore: botCheckResult.suspicionScore,
        ip: req.ip
      });

      // Block if identified as bot with high confidence
      if (botCheckResult.isBot && botCheckResult.confidence >= 70) {
        logger.warn('Registration blocked - Bot detected', {
          email,
          confidence: botCheckResult.confidence,
          reason: botCheckResult.reason,
          flags: botCheckResult.checks?.dataAnalysis?.flags || [],
          ip: req.ip
        });

        return res.status(403).json({
          success: false,
          error: {
            code: 'BOT_DETECTED',
            message: 'Registration failed: Automated behavior detected. Please try again with a different approach.',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Normalize phone (strip spaces and hyphens)
      const normalizedPhone = phone ? phone.replace(/[^\d+]/g, '') : null;

      // Check if user already exists
      const existingUser = await database.prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            ...(normalizedPhone ? [{ phone: normalizedPhone }] : [])
          ]
        }
      });

      if (existingUser) {
        logger.warn('Student registration failed - User already exists', {
          email,
          phone,
          existingUserId: existingUser.id,
          ip: req.ip,
        });

        const message = existingUser.email === email.toLowerCase() 
          ? 'User with this email already exists'
          : 'User with this phone number already exists';

        return res.status(409).json({
          success: false,
          error: {
            code: 'USER_ALREADY_EXISTS',
            message,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Hash password
      const hashedPassword = await passwordUtil.hash(password);

      // Handle file uploads to Cloudinary
      let resumeData = null;
      let profilePhotoData = null;

      if (req.files) {
        if (req.files.resume && req.files.resume[0]) {
          resumeData = await uploadService.processUpload(req.files.resume[0], 'resume');
        }
        if (req.files.profilePhoto && req.files.profilePhoto[0]) {
          profilePhotoData = await uploadService.processUpload(req.files.profilePhoto[0], 'profilePhoto');
        }
      }

      // Create student user with comprehensive profile
      const newUser = await database.prisma.user.create({
        data: {
          // Split name into firstName and lastName
          firstName: name.split(' ')[0].trim(),
          lastName: name.split(' ').slice(1).join(' ').trim() || name.split(' ')[0].trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: 'STUDENT',
          phone: normalizedPhone || null,
          status: 'PENDING_VERIFICATION',
          isVerified: false,
          isActive: true,
        },
      });

      // Create comprehensive student profile
      await database.prisma.profile.create({
        data: {
          userId: newUser.id,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender: normalizedGender || null,
          bio: null,
          
          // Location
          location: `${city || ''}, ${state}`.replace(/^,\s/, ''),
          
          // Career preferences
          skills: normalizedSkills,
          interests: normalizedInterests,
          
          // Documents
          resume: resumeData?.url,
          avatar: profilePhotoData?.url,
          
          // Defaults
          languages: ['English'],
        },
      });

      // Create education record if provided
      if (education && degree) {
        const profile = await database.prisma.profile.findUnique({ where: { userId: newUser.id } });
        await database.prisma.education.create({
          data: {
            profileId: profile.id,
            instituteName: institution || 'Not Specified',
            degree: degree,
            fieldOfStudy: domain || 'General',
            startDate: new Date(),
            endDate: graduationYear ? new Date(graduationYear, 11, 31) : null,
            isCurrent: !graduationYear || graduationYear >= new Date().getFullYear(),
          },
        });
      }

      // Store file metadata
      if (resumeData) {
        await database.prisma.file.create({
          data: {
            userId: newUser.id,
            fileName: resumeData.publicId,
            originalName: req.files.resume[0].originalname,
            fileUrl: resumeData.url,
            publicId: resumeData.publicId,
            mimeType: req.files.resume[0].mimetype,
            fileSize: resumeData.size,
            category: 'RESUME',
          },
        });
      }

      if (profilePhotoData) {
        await database.prisma.file.create({
          data: {
            userId: newUser.id,
            fileName: profilePhotoData.publicId,
            originalName: req.files.profilePhoto[0].originalname,
            fileUrl: profilePhotoData.url,
            publicId: profilePhotoData.publicId,
            mimeType: req.files.profilePhoto[0].mimetype,
            fileSize: profilePhotoData.size,
            category: 'PROFILE_PICTURE',
          },
        });
      }

      // Generate email verification token after user creation
      const verificationToken = jwtUtil.generateEmailVerificationToken({
        id: newUser.id,
        email: newUser.email,
        type: 'email_verification'
      });

      // Send verification email (non-blocking)
      import('../services/emailService.js').then(({ emailService }) => {
        emailService.sendVerificationEmail(newUser.email, verificationToken).catch((err) => {
          logger.warn('Failed to send verification email', { email: newUser.email, error: err.message });
        });
      });

      // Generate authentication tokens
      const tokenPair = jwtUtil.generateTokenPair(newUser);

      logger.info('Student registered successfully', {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        ip: req.ip,
      });

      // Return success response with user data for frontend localStorage
      const userResponse = {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`.trim(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt,
      };

      res.status(201).json({
        success: true,
        message: 'Student registration successful! Please verify your email address.',
        data: {
          user: userResponse,
          accessToken: tokenPair.accessToken, // Frontend expects this for localStorage
          refreshToken: tokenPair.refreshToken,
          redirectUrl: '/student-dashboard'
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Student registration error', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        email: req.body?.email,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Failed to create student account. Please try again.',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Admin Registration - COMPLETELY DISABLED
   * POST /api/v1/auth/register/admin
   * 
   * SECURITY: Only pre-seeded admins can access admin features.
   * No new admin accounts can be created through the API.
   */
  async adminRegister(req, res) {
    try {
      // SECURITY: Admin registration is completely disabled
      // Only pre-seeded admins from the database are allowed
      logger.warn('Admin registration attempt - BLOCKED (Feature Disabled)', {
        email: req.body?.email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      return res.status(403).json({
        success: false,
        error: {
          code: 'ADMIN_REGISTRATION_DISABLED',
          message: 'Admin registration is permanently disabled. Only pre-authorized system administrators can access admin features.',
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Admin registration error', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        email: req.body?.email,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'ADMIN_REGISTRATION_FAILED',
          message: 'Failed to create admin account. Please try again.',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * User login (Student or Admin)
   * POST /api/v1/auth/login
   */
  async login(req, res) {
    try {
      const { email, password, remember = false, userType = 'student' } = req.body;

      logger.info('Login attempt', {
        email,
        userType,
        remember,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });

      // Find user by email
      const user = await database.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          profile: true,
        },
      });

      if (!user) {
        logger.warn('Login failed - User not found', {
          email,
          userType,
          ip: req.ip,
        });

        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Verify user type matches expected role
      const expectedRole = userType === 'admin' ? 'ADMIN' : 'STUDENT';
      if (user.role !== expectedRole) {
        logger.warn('Login failed - Role mismatch', {
          userId: user.id,
          email,
          userRole: user.role,
          expectedRole,
          userType,
          ip: req.ip,
        });

        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_USER_TYPE',
            message: `Invalid ${userType} credentials`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // SECURITY: Admin access is strictly controlled by whitelist of pre-seeded accounts
      if (userType === 'admin') {
        const AUTHORIZED_ADMIN_EMAILS = [
          'divyanshuchannel2@gmail.com',
          'singhmanvi5983@gmail.com', 
          'analyst@pminternship.gov.in',
          'operations@pminternship.gov.in'
        ];
        
        if (!AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase())) {
          logger.warn('Admin login attempt with unauthorized email - BLOCKED', {
            email,
            userId: user.id,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
          
          return res.status(403).json({
            success: false,
            error: {
              code: 'UNAUTHORIZED_ADMIN_ACCESS',
              message: 'Access denied. Only pre-authorized system administrators can access admin features.',
            },
            timestamp: new Date().toISOString(),
          });
        }
        
        logger.info('Authorized admin login attempt', {
          email,
          userId: user.id,
          ip: req.ip,
        });
      }

      // Check if account is active
      if (!user.isActive) {
        logger.warn('Login failed - Account inactive', {
          userId: user.id,
          email,
          status: user.status,
          ip: req.ip,
        });

        return res.status(401).json({
          success: false,
          error: {
            code: 'ACCOUNT_INACTIVE',
            message: 'Your account has been deactivated. Please contact support.',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if account is suspended or banned
      if (user.status === 'SUSPENDED' || user.status === 'BANNED') {
        logger.warn('Login failed - Account restricted', {
          userId: user.id,
          email,
          status: user.status,
          ip: req.ip,
        });

        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCOUNT_RESTRICTED',
            message: `Your account has been ${user.status.toLowerCase()}. Please contact support.`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if email is verified (for students only)
      // Skip email verification check in development mode for easier testing
      if (user.role === 'STUDENT' && !user.isVerified && process.env.NODE_ENV !== 'development') {
        logger.warn('Login failed - Email not verified', {
          userId: user.id,
          email,
          ip: req.ip,
        });

        return res.status(403).json({
          success: false,
          error: {
            code: 'EMAIL_NOT_VERIFIED',
            message: 'Please verify your email address before logging in. Check your inbox for verification link.',
            needsEmailVerification: true,
            email: user.email
          },
          timestamp: new Date().toISOString(),
        });
      } else if (user.role === 'STUDENT' && !user.isVerified && process.env.NODE_ENV === 'development') {
        // In development mode, auto-verify the user for easier testing
        logger.info('Development mode: Auto-verifying user for login', {
          userId: user.id,
          email,
        });
        try {
          await database.prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, status: 'ACTIVE', emailVerifiedAt: new Date() }
          });
          user.isVerified = true;
          user.status = 'ACTIVE';
        } catch (updateError) {
          logger.warn('Failed to auto-verify user in development mode', {
            userId: user.id,
            error: updateError.message,
          });
          // Continue with login even if verification update fails
        }
      }

      // Verify password
      const isPasswordValid = await passwordUtil.compare(password, user.password);
      if (!isPasswordValid) {
        logger.warn('Login failed - Invalid password', {
          userId: user.id,
          email,
          ip: req.ip,
        });

        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Generate JWT tokens
      const tokenPair = jwtUtil.generateTokenPair(user);

      // Store refresh token in database
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

      await database.prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: tokenPair.refreshToken,
          expiresAt,
          deviceInfo: req.get('User-Agent'),
          ipAddress: req.ip,
        },
      });

      // Update last login timestamp
      await database.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      logger.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
        role: user.role,
        ip: req.ip,
      });

      // Prepare user data for response (exclude sensitive information)
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        lastLoginAt: new Date().toISOString(),
        isFirstLogin: !user.lastLoginAt, // Track if this is the user's first login
        profile: user.profile ? {
          bio: user.profile.bio,
          location: user.profile.location,
          avatar: user.profile.avatar,
          skills: user.profile.skills,
          interests: user.profile.interests,
        } : null,
      };

      // Set httpOnly cookie for refresh token (optional)
      if (remember) {
        res.cookie('refreshToken', tokenPair.refreshToken, {
          httpOnly: true,
          secure: config.app.isProduction,
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
      }

      res.status(200).json({
        success: true,
        message: `Welcome back, ${user.firstName}!`,
        data: {
          user: userData,
          accessToken: tokenPair.accessToken, // Frontend expects accessToken for localStorage
          refreshToken: tokenPair.refreshToken,
          redirectUrl: user.role === 'ADMIN' ? '/admin' : '/student-dashboard',
          // Role-specific data
          dashboard: {
            defaultRoute: user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard',
            features: user.role === 'ADMIN' ? [
              'manage_users',
              'manage_internships',
              'view_analytics',
              'generate_reports',
              'system_settings',
              'audit_logs',
            ] : [
              'browse_internships',
              'apply_internships',
              'track_applications',
              'manage_profile',
              'view_notifications',
            ],
            permissions: user.role === 'ADMIN' ? [
              'create_internships',
              'update_any_internship',
              'delete_internships',
              'manage_users',
              'view_all_applications',
              'generate_reports',
            ] : [
              'create_applications',
              'update_own_profile',
              'view_own_applications',
            ],
          },
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Login error', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        email: req.body?.email,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: 'Login failed due to server error. Please try again.',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get role-specific dashboard data
   * @private
   */
  getRoleDashboardData(role) {
    const dashboardData = {
      STUDENT: {
        defaultRoute: '/dashboard',
        features: [
          'browse_internships',
          'apply_internships',
          'track_applications',
          'manage_profile',
          'view_notifications',
        ],
        permissions: [
          'create_applications',
          'update_own_profile',
          'view_own_applications',
        ],
      },
      ADMIN: {
        defaultRoute: '/admin/dashboard',
        features: [
          'manage_users',
          'manage_internships',
          'view_analytics',
          'generate_reports',
          'system_settings',
          'audit_logs',
        ],
        permissions: [
          'create_internships',
          'update_any_internship',
          'delete_internships',
          'manage_users',
          'view_all_applications',
          'generate_reports',
        ],
      },
    };

    return dashboardData[role] || dashboardData.STUDENT;
  }

  /**
   * Refresh access token using refresh token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(req, res) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'NO_REFRESH_TOKEN',
            message: 'Refresh token is required',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Verify refresh token
      let decoded;
      try {
        decoded = jwtUtil.verifyRefreshToken(refreshToken);
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_REFRESH_TOKEN',
            message: 'Invalid or expired refresh token',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if refresh token exists in database
      const storedToken = await database.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.isRevoked) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'REFRESH_TOKEN_REVOKED',
            message: 'Refresh token has been revoked',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if token is expired
      if (new Date() > storedToken.expiresAt) {
        await database.prisma.refreshToken.update({
          where: { id: storedToken.id },
          data: { isRevoked: true, revokedAt: new Date() },
        });

        return res.status(401).json({
          success: false,
          error: {
            code: 'REFRESH_TOKEN_EXPIRED',
            message: 'Refresh token has expired',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Generate new access token
      const newAccessToken = jwtUtil.generateAccessToken(storedToken.user);

      logger.info('Access token refreshed', {
        userId: storedToken.user.id,
        ip: req.ip,
      });

      res.status(200).json({
        success: true,
        message: 'Access token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          tokenType: 'Bearer',
          expiresIn: config.jwt.accessExpiry,
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Token refresh error', {
        error: error.message,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'TOKEN_REFRESH_FAILED',
          message: 'Failed to refresh token',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * User logout
   * POST /api/v1/auth/logout
   */
  async logout(req, res) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

      if (refreshToken) {
        // Revoke refresh token
        await database.prisma.refreshToken.updateMany({
          where: { token: refreshToken },
          data: { isRevoked: true, revokedAt: new Date() },
        });
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      logger.info('User logged out', {
        userId: req.user?.id,
        ip: req.ip,
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Logout error', {
        error: error.message,
        userId: req.user?.id,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Logout failed',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  async getCurrentUser(req, res) {
    try {
      const user = await database.prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          profile: {
            include: {
              education: true,
              experience: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Prepare user data (exclude sensitive information)
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        phone: user.phone,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        profile: user.profile,
        dashboard: this.getRoleDashboardData(user.role),
      };

      res.status(200).json({
        success: true,
        data: { user: userData },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Get current user error', {
        error: error.message,
        userId: req.user?.id,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USER_FAILED',
          message: 'Failed to fetch user data',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Email Verification
   * POST /api/v1/auth/verify-email
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      logger.info('Email verification attempt', {
        token: token.substring(0, 10) + '...', // Log partial token for security
        ip: req.ip,
      });

      // Verify the email verification token
      let decoded;
      try {
        decoded = jwtUtil.verifyEmailVerificationToken(token);
      } catch (error) {
        logger.warn('Email verification failed - Invalid token', {
          error: error.message,
          ip: req.ip,
        });

        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_VERIFICATION_TOKEN',
            message: 'Invalid or expired verification token',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Find user by email from decoded token
      const user = await database.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if already verified
      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_VERIFIED',
            message: 'Email is already verified',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Mark email as verified and activate account
      await database.prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          status: 'ACTIVE',
        },
      });

      logger.info('Email verified successfully', {
        userId: user.id,
        email: user.email,
        ip: req.ip,
      });

      res.status(200).json({
        success: true,
        message: 'Email verified successfully. You can now log in to your account.',
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Email verification error', {
        error: error.message,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'VERIFICATION_FAILED',
          message: 'Email verification failed',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Resend Email Verification
   * POST /api/v1/auth/resend-verification
   */
  async resendEmailVerification(req, res) {
    try {
      const { email } = req.body;

      logger.info('Resend email verification attempt', {
        email,
        ip: req.ip,
      });

      // Find student user by email
      const user = await database.prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          role: 'STUDENT',
          isActive: true
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'STUDENT_NOT_FOUND',
            message: 'Student account not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if already verified
      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_VERIFIED',
            message: 'Email is already verified',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Generate new verification token
      const verificationToken = jwtUtil.generateEmailVerificationToken({
        id: user.id,
        email: user.email,
        type: 'email_verification'
      });

      // Send verification email (non-blocking)
      import('../services/emailService.js').then(({ emailService }) => {
        emailService.sendVerificationEmail(user.email, verificationToken).catch((err) => {
          logger.warn('Failed to resend verification email', { email: user.email, error: err.message });
        });
      });

      logger.info('Verification email resent', {
        userId: user.id,
        email: user.email,
        ip: req.ip,
      });

      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully. Please check your inbox.',
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Resend verification error', {
        error: error.message,
        email: req.body?.email,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'RESEND_VERIFICATION_FAILED',
          message: 'Failed to send verification email. Please try again.',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Forgot Password - Send reset email
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      logger.info('Forgot password attempt', {
        email,
        ip: req.ip,
      });

      // Find user by email
      const user = await database.prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          isActive: true
        },
      });

      if (!user) {
        // Don't reveal if user exists or not for security
        return res.status(200).json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.',
          timestamp: new Date().toISOString(),
        });
      }

      // Generate password reset token
      const resetToken = jwtUtil.generatePasswordResetToken({
        id: user.id,
        email: user.email,
        type: 'password_reset'
      });

      // Send password reset email (non-blocking)
      import('../services/emailService.js').then(({ emailService }) => {
        emailService.sendPasswordResetEmail(user.email, resetToken).catch((err) => {
          logger.warn('Failed to send password reset email', { email: user.email, error: err.message });
        });
      });

      logger.info('Password reset email sent', {
        userId: user.id,
        email: user.email,
        ip: req.ip,
      });

      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Forgot password error', {
        error: error.message,
        email: req.body?.email,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_FAILED',
          message: 'Failed to process password reset request. Please try again.',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Reset Password using token
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      logger.info('Password reset attempt', {
        token: token.substring(0, 10) + '...',
        ip: req.ip,
      });

      // Verify password reset token
      let decoded;
      try {
        decoded = jwtUtil.verifyPasswordResetToken(token);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_RESET_TOKEN',
            message: 'Invalid or expired password reset token',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Find user by ID from token
      const user = await database.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.isActive) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found or account is inactive',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Hash new password
      const hashedPassword = await passwordUtil.hash(password);

      // Update password
      await database.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          // Invalidate all existing sessions by updating a timestamp
          updatedAt: new Date(),
        },
      });

      // Revoke all existing refresh tokens for security
      await database.prisma.refreshToken.updateMany({
        where: { userId: user.id },
        data: { 
          isRevoked: true, 
          revokedAt: new Date() 
        },
      });

      logger.info('Password reset successful', {
        userId: user.id,
        email: user.email,
        ip: req.ip,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset successfully. Please log in with your new password.',
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Password reset error', {
        error: error.message,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'RESET_PASSWORD_FAILED',
          message: 'Password reset failed. Please try again.',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Change Password (for authenticated users)
   * POST /api/v1/auth/change-password
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      logger.info('Change password attempt', {
        userId,
        ip: req.ip,
      });

      // Get user with current password
      const user = await database.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await passwordUtil.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        logger.warn('Change password failed - Invalid current password', {
          userId,
          ip: req.ip,
        });

        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CURRENT_PASSWORD',
            message: 'Current password is incorrect',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if new password is different from current
      const isSamePassword = await passwordUtil.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'SAME_PASSWORD',
            message: 'New password must be different from current password',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Hash new password
      const hashedNewPassword = await passwordUtil.hash(newPassword);

      // Update password
      await database.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      });

      logger.info('Password changed successfully', {
        userId,
        ip: req.ip,
      });

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Change password error', {
        error: error.message,
        userId: req.user?.id,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'CHANGE_PASSWORD_FAILED',
          message: 'Failed to change password. Please try again.',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

const authController = new AuthController();
export default authController;
