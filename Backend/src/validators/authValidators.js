import Joi from 'joi';

// Validation schemas for authentication endpoints

/**
 * Student Registration Validation Schema
 * Matches the 4-step frontend registration process
 */
export const studentRegisterSchema = Joi.object({
  // Step 1: Personal Details
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .pattern(/^[a-zA-Z\s.'-]+$/)
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'string.pattern.base': 'Name can only contain letters and spaces'
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),

  phone: Joi.string()
    .pattern(/^\+?[0-9\s-]{10,20}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number (digits, spaces, hyphens allowed, optional +)',
      'string.empty': 'Phone number is required'
    }),

  dateOfBirth: Joi.date()
    .min('1960-01-01')
    .max('now')
    .iso()
    .allow(null, ''),

  gender: Joi.alternatives()
    .try(
      Joi.string().custom((value, helpers) => {
        if (value === null || value === undefined || value === '') return '';
        const v = String(value).trim().toLowerCase();
        if (v === 'male') return 'MALE';
        if (v === 'female') return 'FEMALE';
        if (v === 'other') return 'OTHER';
        if (['prefernottosay','prefer_not_to_say','prefer-not-to-say','prefer not to say'].includes(v)) return 'PREFER_NOT_TO_SAY';
        return helpers.error('any.only');
      }),
      Joi.string().valid('MALE','FEMALE','OTHER','PREFER_NOT_TO_SAY')
    )
    .allow(null, ''),

  // Step 2: Education & Skills
  education: Joi.string()
    .valid(
      'belowTenth', 'tenth', 'twelfth', 'diploma', 
      'undergraduate', 'postgraduate', 'doctorate', 'other'
    )
    .required()
    .messages({
      'any.required': 'Education level is required',
      'any.only': 'Please select a valid education level'
    }),

  degree: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .allow(null, ''),

  institution: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .allow(null, ''),

  graduationYear: Joi.alternatives().try(
      Joi.number().integer().min(1990).max(new Date().getFullYear() + 6),
      Joi.string().valid('')
    ).allow(null, ''),

  domain: Joi.string()
    .valid(
      'technology', 'healthcare', 'education', 'finance', 'marketing',
      'engineering', 'design', 'agriculture', 'government', 'nonprofit',
      'media', 'tourism', 'other'
    )
    .required()
    .messages({
      'any.required': 'Domain selection is required',
      'any.only': 'Please select a valid domain'
    }),

  // Accept arrays coming from multipart/form-data in multiple formats
  // - Actual JSON string: ["a","b"]
  // - CSV or bracketed without quotes: [a,b] or a,b
  // - Already an array
  skills: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().trim().min(1)).min(1).max(20),
      Joi.any().custom((value, helpers) => {
        // Already an array
        if (Array.isArray(value)) return value;

        if (typeof value === 'string') {
          const raw = value.trim();

          // Try JSON first
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
          } catch (e) {}

          // Remove surrounding brackets if present and split by comma
          const sanitized = raw.replace(/^\[|\]$/g, '');
          const parts = sanitized.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
          if (parts.length > 0) return parts;
        }

        return helpers.error('any.invalid');
      })
    )
    .required()
    .messages({
      'array.min': 'Please select at least one skill',
      'array.max': 'You can select maximum 20 skills',
      'any.required': 'Skills selection is required'
    }),

  experience: Joi.string()
    .valid('fresher', 'lessThanYear', 'oneToTwo', 'twoToFive', 'moreThanFive')
    .allow(null, ''),

  // Step 3: Location & Interests
  state: Joi.string()
    .valid(
      'andhraPradesh', 'arunachalPradesh', 'assam', 'bihar', 'chhattisgarh',
      'goa', 'gujarat', 'haryana', 'himachalPradesh', 'jharkhand', 'karnataka',
      'kerala', 'madhyaPradesh', 'maharashtra', 'manipur', 'meghalaya',
      'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim',
      'tamilNadu', 'telangana', 'tripura', 'uttarPradesh', 'uttarakhand',
      'westBengal', 'delhiNCT', 'chandigarh', 'jammuKashmir', 'ladakh', 'puducherry'
    )
    .required()
    .messages({
      'any.required': 'State selection is required',
      'any.only': 'Please select a valid Indian state'
    }),

  city: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .allow(null, ''),

  // Same flexible parsing for interests
  interests: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().trim().min(1)).min(1).max(12),
      Joi.any().custom((value, helpers) => {
        if (Array.isArray(value)) return value;

        if (typeof value === 'string') {
          const raw = value.trim();

          // Try JSON first
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
          } catch (e) {}

          // Remove surrounding brackets and split
          const sanitized = raw.replace(/^\[|\]$/g, '');
          const parts = sanitized.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
          if (parts.length > 0) return parts;
        }

        return helpers.error('any.invalid');
      })
    )
    .required()
    .messages({
      'array.min': 'Please select at least one career interest',
      'array.max': 'You can select maximum 12 interests',
      'any.required': 'Career interests selection is required'
    }),

  workPreference: Joi.string()
    .valid('remote', 'onsite', 'hybrid', 'noPreference')
    .allow(null, ''),

  // Step 4: Security & Documents
  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.empty': 'Password is required'
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Password confirmation is required'
    }),

  // Optional files (handled separately in multer)
  resume: Joi.any().optional(),
  profilePhoto: Joi.any().optional(),

  // Auto-set role
  role: Joi.string().valid('STUDENT').default('STUDENT')
}).unknown(); // Allow unknown fields for flexibility

/**
 * Admin Registration Validation Schema
 * Simpler validation for admin accounts
 */
export const adminRegisterSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.empty': 'First name is required',
      'string.pattern.base': 'First name can only contain letters and spaces'
    }),

  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.empty': 'Last name is required',
      'string.pattern.base': 'Last name can only contain letters and spaces'
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),

  phone: Joi.string()
    .pattern(/^\+?[0-9\s-]{10,20}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number (digits, spaces, hyphens allowed, optional +)'
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long'
    }),

  // Department & Role Info
  department: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .allow(null, ''),

  designation: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .allow(null, ''),

  // Auto-set role
  role: Joi.string().valid('ADMIN').default('ADMIN'),

  // Admin-specific validation token (optional)
  adminToken: Joi.string().allow(null, '')

}).unknown();

/**
 * Login Validation Schema
 * Used for both students and admins
 */
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),

  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Password is required'
    }),

  remember: Joi.boolean().default(false),

  // Role validation from frontend
  userType: Joi.string()
    .valid('student', 'admin')
    .default('student')

}).unknown();

/**
 * Refresh Token Validation Schema
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Refresh token is required'
    })
});

/**
 * Email Verification Validation Schema
 */
export const emailVerificationSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Verification token is required'
    })
});

/**
 * Password Reset Request Validation Schema
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    })
});

/**
 * Password Reset Validation Schema
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Reset token is required'
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long'
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match'
    })
});

/**
 * Change Password Validation Schema (for authenticated users)
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required'
    }),

  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long'
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match'
    })
});

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown fields
      convert: true, // Convert strings to proper types
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: errors
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

// Validation helper functions
export const validateIndianPhone = (phone) => {
  const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
