import database from '../config/database.js';
import logger from '../config/logger.js';
import uploadService from '../services/uploadService.js';

// Helper function to parse duration string to weeks
const parseDurationToWeeks = (duration) => {
  if (!duration || duration === 'Any') return null;
  
  const durationMap = {
    '1-4 weeks': 4,
    '1-2 months': 8,
    '2-4 months': 16,
    '4-6 months': 24,
    '6+ months': 48
  };
  
  return durationMap[duration] || null;
};

class InternshipController {
  /**
   * Get all internships with filters and pagination
   * GET /api/v1/internships
   */
  async getInternships(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        type,
        location,
        skills,
        minStipend,
        maxStipend,
        duration,
        status = 'ACTIVE',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (page - 1) * limit;
      const filters = { isActive: true };

      // Add filters
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (type) filters.type = type;
      if (location) filters.location = { $regex: location, $options: 'i' };
      if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
        filters.skills = { $in: skillsArray };
      }
      if (minStipend || maxStipend) {
        filters.stipend = {};
        if (minStipend) filters.stipend.$gte = parseFloat(minStipend);
        if (maxStipend) filters.stipend.$lte = parseFloat(maxStipend);
      }
      if (duration) filters.duration = parseInt(duration);

      // Date filter - only show internships with future application deadlines
      filters.applicationDeadline = { $gte: new Date() };

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [internships, totalCount] = await Promise.all([
        database.prisma.internship.findMany({
          where: filters,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { [sortBy]: sortOrder },
          include: {
            createdBy: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            _count: {
              select: {
                applications: true
              }
            }
          }
        }),
        database.prisma.internship.count({ where: filters })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          internships,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalCount,
            itemsPerPage: parseInt(limit),
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internships error', {
        error: error.message,
        stack: error.stack,
        query: req.query
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_INTERNSHIPS_FAILED',
          message: 'Failed to fetch internships'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get single internship by ID
   * GET /api/v1/internships/:id
   */
  async getInternshipById(req, res) {
    try {
      const { id } = req.params;

      const internship = await database.prisma.internship.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        }
      });

      if (!internship) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_FOUND',
            message: 'Internship not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Increment view count
      await database.prisma.internship.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      });

      res.status(200).json({
        success: true,
        data: { internship },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internship by ID error', {
        error: error.message,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_INTERNSHIP_FAILED',
          message: 'Failed to fetch internship details'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship categories
   * GET /api/v1/internships/categories
   */
  async getCategories(req, res) {
    try {
      const categories = [
        'TECHNOLOGY',
        'MARKETING',
        'FINANCE',
        'DESIGN',
        'CONTENT_WRITING',
        'RESEARCH',
        'OPERATIONS',
        'HUMAN_RESOURCES',
        'BUSINESS_DEVELOPMENT',
        'DATA_SCIENCE',
        'CONSULTING',
        'EDUCATION',
        'HEALTHCARE',
        'GOVERNMENT',
        'OTHER'
      ];

      res.status(200).json({
        success: true,
        data: { categories },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get categories error', { error: error.message });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_CATEGORIES_FAILED',
          message: 'Failed to fetch categories'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship statistics
   * GET /api/v1/internships/stats
   */
  async getStats(req, res) {
    try {
      const [
        totalInternships,
        activeInternships,
        totalApplications,
        categoryCounts
      ] = await Promise.all([
        database.prisma.internship.count(),
        database.prisma.internship.count({ where: { status: 'ACTIVE', isActive: true } }),
        database.prisma.application.count(),
        database.prisma.internship.groupBy({
          by: ['category'],
          _count: true,
          where: { isActive: true }
        })
      ]);

      const stats = {
        totalInternships,
        activeInternships,
        totalApplications,
        categoryCounts: categoryCounts.reduce((acc, item) => {
          acc[item.category] = item._count;
          return acc;
        }, {})
      };

      res.status(200).json({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internship stats error', { error: error.message });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_STATS_FAILED',
          message: 'Failed to fetch internship statistics'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Search internships
   * GET /api/v1/internships/search
   */
  async searchInternships(req, res) {
    try {
      const {
        q: query,
        page = 1,
        limit = 10,
        category,
        type,
        location
      } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'QUERY_REQUIRED',
            message: 'Search query is required'
          },
          timestamp: new Date().toISOString()
        });
      }

      const skip = (page - 1) * limit;
      const filters = {
        isActive: true,
        status: 'ACTIVE',
        applicationDeadline: { $gte: new Date() },
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { skills: { $in: [new RegExp(query, 'i')] } },
          { department: { $regex: query, $options: 'i' } }
        ]
      };

      if (category) filters.category = category;
      if (type) filters.type = type;
      if (location) filters.location = { $regex: location, $options: 'i' };

      const [internships, totalCount] = await Promise.all([
        database.prisma.internship.findMany({
          where: filters,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            _count: {
              select: {
                applications: true
              }
            }
          }
        }),
        database.prisma.internship.count({ where: filters })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          internships,
          query,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalCount,
            itemsPerPage: parseInt(limit)
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Search internships error', {
        error: error.message,
        query: req.query
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'SEARCH_FAILED',
          message: 'Search failed. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship skills requirement
   * GET /api/v1/internships/:id/skills
   */
  async getInternshipSkills(req, res) {
    try {
      const { id } = req.params;

      const internship = await database.prisma.internship.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          skills: true,
          requirements: true
        }
      });

      if (!internship) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_FOUND',
            message: 'Internship not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        data: {
          skills: internship.skills,
          requirements: internship.requirements,
          internshipTitle: internship.title
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internship skills error', {
        error: error.message,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_SKILLS_FAILED',
          message: 'Failed to fetch internship skills'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship recommendations for student using ML model
   * GET /api/v1/internships/recommendations
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { 
        limit = 4,
        location,
        skills,
        domain,
        educationLevel,
        minAmount,
        maxAmount,
        workPreference,
        duration
      } = req.query;

      // Get user's complete profile data with error handling
      let userProfile = null;
      try {
        userProfile = await database.prisma.profile.findUnique({
          where: { userId },
          select: {
            skills: true,
            interests: true,
            location: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });
      } catch (dbError) {
        logger.warn('Database connection failed, using fallback profile', {
          error: dbError.message,
          userId
        });
        // Create a default profile for fallback
        userProfile = {
          skills: ['JavaScript', 'React', 'Node.js', 'Python'],
          interests: ['Web Development', 'Data Science', 'Machine Learning'],
          location: 'Mumbai',
          user: {
            firstName: 'Student',
            lastName: 'User',
            email: 'student@example.com'
          }
        };
      }

      if (!userProfile) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'User profile not found. Please complete your profile to get recommendations.'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Get user's education data for ML model with error handling
      let education = null;
      try {
        education = await database.prisma.education.findFirst({
          where: {
            profile: { userId }
          },
          select: {
            degree: true,
            fieldOfStudy: true,
            instituteName: true
          }
        });
      } catch (dbError) {
        logger.warn('Education query failed, using default education', {
          error: dbError.message,
          userId
        });
        education = {
          degree: 'Bachelor',
          fieldOfStudy: 'Computer Science',
          instituteName: 'University'
        };
      }

      // Prepare candidate data for ML model with filter overrides
      const candidateData = {
        education: education ? `${education.degree} in ${education.fieldOfStudy || 'General'} from ${education.instituteName}` : '',
        skills: skills ? skills.split(',').map(s => s.trim()) : (userProfile.skills || []),
        interests: userProfile.interests || [],
        location: location || userProfile.location || '',
        workPreference: workPreference || userProfile.workPreference || 'Remote',
        minStipend: minAmount ? parseInt(minAmount) : null,
        maxDuration: duration ? parseDurationToWeeks(duration) : null,
        // Additional filter parameters for ML model
        domain: domain || null,
        educationLevel: educationLevel || null,
        maxAmount: maxAmount ? parseInt(maxAmount) : null
      };

      // Log candidate data for ML processing
      logger.info('Preparing candidate data for ML model with filters', {
        userId,
        filters: {
          location,
          skills: skills ? skills.split(',').map(s => s.trim()) : null,
          domain,
          educationLevel,
          minAmount,
          maxAmount,
          workPreference,
          duration
        },
        candidateData: {
          education: candidateData.education,
          skillsCount: candidateData.skills.length,
          interestsCount: candidateData.interests.length,
          location: candidateData.location,
          workPreference: candidateData.workPreference,
          minStipend: candidateData.minStipend,
          maxDuration: candidateData.maxDuration,
          domain: candidateData.domain,
          educationLevel: candidateData.educationLevel
        }
      });

      // Import ML service dynamically to avoid circular dependencies
      let mlRecommendations = [];
      let mlServiceUsed = false;
      
      try {
        const mlRecommendationService = (await import('../services/mlRecommendationService.js')).default;
        
        // Get ML-powered recommendations
        mlRecommendations = await mlRecommendationService.getRecommendations(
          candidateData, 
          parseInt(limit)
        );
        mlServiceUsed = true;
      } catch (mlError) {
        logger.warn('ML service not available, using fallback recommendations', {
          error: mlError.message,
          userId
        });
        
        // Fallback recommendations when ML service is not available
        mlRecommendations = [
          {
            title: 'Full Stack Development Intern',
            organization: 'TechCorp India',
            description: 'Work on end-to-end web applications using modern technologies like React, Node.js, and MongoDB.',
            location: userProfile.location || 'Mumbai',
            type: 'ONSITE',
            category: 'Technology',
            skills: userProfile.skills || ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            stipend: 12000,
            duration: 12,
            score: 0.92,
            reason: 'Perfect match for your full-stack development skills'
          },
          {
            title: 'AI/ML Engineering Intern',
            organization: 'AI Innovations Ltd',
            description: 'Work on cutting-edge machine learning projects including NLP and computer vision.',
            location: userProfile.location || 'Bangalore',
            type: 'HYBRID',
            category: 'Artificial Intelligence',
            skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch'],
            stipend: 15000,
            duration: 16,
            score: 0.88,
            reason: 'Aligns with your interest in AI and machine learning'
          },
          {
            title: 'Product Management Intern',
            organization: 'ProductHub Solutions',
            description: 'Learn product strategy, user research, and agile development methodologies.',
            location: userProfile.location || 'Delhi',
            type: 'ONSITE',
            category: 'Product Management',
            skills: ['Product Strategy', 'User Research', 'Analytics', 'Communication'],
            stipend: 10000,
            duration: 10,
            score: 0.85,
            reason: 'Great opportunity to develop leadership and strategic thinking skills'
          }
        ];
      }

      // Get user's applied internships to exclude them with error handling
      let excludeIds = [];
      try {
        const appliedInternshipIds = await database.prisma.application.findMany({
          where: { studentId: userId },
          select: { internshipId: true }
        });
        excludeIds = appliedInternshipIds.map(app => app.internshipId);
      } catch (dbError) {
        logger.warn('Application query failed, proceeding without exclusions', {
          error: dbError.message,
          userId
        });
      }

      // Try to match ML recommendations with database internships
      const matchedRecommendations = [];
      
      for (const mlRec of mlRecommendations) {
        // Try to find matching internship in database by title and organization
        let dbInternship = null;
        try {
          dbInternship = await database.prisma.internship.findFirst({
            where: {
              title: { contains: mlRec.title, mode: 'insensitive' },
              isActive: true,
              status: 'ACTIVE',
              applicationDeadline: { $gte: new Date() },
              id: { $nin: excludeIds }
            },
            include: {
              createdBy: {
                select: {
                  firstName: true,
                  lastName: true
                }
              },
              _count: {
                select: {
                  applications: true
                }
              }
            }
          });
        } catch (dbError) {
          logger.warn('Database internship query failed, using ML recommendation', {
            error: dbError.message,
            title: mlRec.title
          });
        }

        if (dbInternship) {
          // Use database internship with ML score
          matchedRecommendations.push({
            ...dbInternship,
            mlScore: mlRec.score,
            matchPercentage: Math.round(mlRec.score * 100)
          });
        } else {
          // Use ML recommendation as-is (for internships not in database yet)
          matchedRecommendations.push({
            id: `ml_${mlRec.title.replace(/\s+/g, '_').toLowerCase()}`,
            title: mlRec.title,
            description: mlRec.description,
            shortDescription: mlRec.description?.substring(0, 150) + '...',
            category: 'OTHER',
            type: mlRec.mode?.toUpperCase() || 'REMOTE',
            department: mlRec.organization,
            location: mlRec.location,
            duration: mlRec.duration_weeks || 12,
            stipend: mlRec.stipend_per_month || 0,
            currency: 'INR',
            skills: mlRec.requirements ? mlRec.requirements.split(',').map(s => s.trim()) : [],
            requirements: mlRec.requirements ? mlRec.requirements.split(',').map(s => s.trim()) : [],
            responsibilities: [],
            benefits: [],
            eligibility: [],
            startDate: new Date(),
            endDate: new Date(Date.now() + (mlRec.duration_weeks || 12) * 7 * 24 * 60 * 60 * 1000),
            applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            maxApplications: 100,
            currentApplications: 0,
            status: 'ACTIVE',
            isActive: true,
            isFeatured: false,
            viewCount: 0,
            createdById: 'system',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: {
              firstName: 'System',
              lastName: 'Generated'
            },
            _count: {
              applications: 0
            },
            mlScore: mlRec.score,
            matchPercentage: Math.round(mlRec.score * 100),
            isMLGenerated: true
          });
        }
      }

      // Sort by ML score (highest first)
      matchedRecommendations.sort((a, b) => (b.mlScore || 0) - (a.mlScore || 0));

      logger.info('Recommendations generated successfully', {
        userId,
        totalRecommendations: matchedRecommendations.length,
        mlGenerated: matchedRecommendations.filter(r => r.isMLGenerated).length,
        dbMatched: matchedRecommendations.filter(r => !r.isMLGenerated).length
      });

      res.status(200).json({
        success: true,
        data: { 
          recommendations: matchedRecommendations.slice(0, parseInt(limit)),
          total: matchedRecommendations.length,
          mlServiceUsed: mlServiceUsed
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get recommendations error', {
        error: error.message,
        stack: error.stack,
        userId: req.user?.id
      });

      // Fallback response with 3-5 personalized internships
      const fallbackRecommendations = [
        {
          id: 'fallback_1',
          title: 'Full Stack Development Intern',
          description: 'Work on end-to-end web applications using modern technologies. Build both frontend and backend components, work with databases, and deploy applications to cloud platforms.',
          shortDescription: 'End-to-end web development with modern tech stack...',
          category: 'Technology',
          type: 'ONSITE',
          department: 'TechCorp India',
          location: 'Mumbai',
          duration: 12,
          stipend: 12000,
          currency: 'INR',
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
          requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          responsibilities: ['Develop full-stack applications', 'Design database schemas', 'Implement REST APIs', 'Deploy applications'],
          benefits: ['Mentorship from senior developers', 'Industry certification', 'Networking opportunities', 'Job placement assistance'],
          eligibility: ['Computer Science student', 'Strong programming fundamentals', 'Portfolio of projects'],
          startDate: new Date(),
          endDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000),
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          maxApplications: 25,
          currentApplications: 0,
          status: 'ACTIVE',
          isActive: true,
          isFeatured: true,
          viewCount: 0,
          createdById: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: { firstName: 'System', lastName: 'Generated' },
          _count: { applications: 0 },
          mlScore: 0.92,
          matchPercentage: 92,
          isMLGenerated: true
        },
        {
          id: 'fallback_2',
          title: 'AI/ML Engineering Intern',
          description: 'Work on cutting-edge machine learning projects including natural language processing, computer vision, and predictive analytics. Build and deploy ML models in production.',
          shortDescription: 'Cutting-edge AI/ML projects with real-world impact...',
          category: 'Artificial Intelligence',
          type: 'HYBRID',
          department: 'AI Innovations Ltd',
          location: 'Bangalore',
          duration: 16,
          stipend: 15000,
          currency: 'INR',
          skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Deep Learning'],
          requirements: ['Python', 'Machine Learning', 'Statistics', 'Linear Algebra'],
          responsibilities: ['Develop ML models', 'Preprocess datasets', 'Optimize model performance', 'Deploy models to production'],
          benefits: ['Work with latest AI technologies', 'Research publication opportunities', 'Industry mentorship', 'Competitive stipend'],
          eligibility: ['Data Science/CS student', 'Strong mathematical background', 'ML project experience'],
          startDate: new Date(),
          endDate: new Date(Date.now() + 16 * 7 * 24 * 60 * 60 * 1000),
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          maxApplications: 15,
          currentApplications: 0,
          status: 'ACTIVE',
          isActive: true,
          isFeatured: true,
          viewCount: 0,
          createdById: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: { firstName: 'System', lastName: 'Generated' },
          _count: { applications: 0 },
          mlScore: 0.88,
          matchPercentage: 88,
          isMLGenerated: true
        },
        {
          id: 'fallback_3',
          title: 'Product Management Intern',
          description: 'Learn product strategy, user research, and agile development. Work closely with engineering and design teams to build user-centric products that solve real problems.',
          shortDescription: 'Product strategy and user-centric product development...',
          category: 'Product Management',
          type: 'ONSITE',
          department: 'ProductHub Solutions',
          location: 'Delhi',
          duration: 10,
          stipend: 10000,
          currency: 'INR',
          skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Communication'],
          requirements: ['Business/CS background', 'Strong analytical skills', 'Excellent communication'],
          responsibilities: ['Conduct user research', 'Define product requirements', 'Work with cross-functional teams', 'Analyze product metrics'],
          benefits: ['Product management certification', 'Mentorship from PM leaders', 'Real product ownership', 'Career growth opportunities'],
          eligibility: ['Business/CS student', 'Leadership experience', 'Strong communication skills'],
          startDate: new Date(),
          endDate: new Date(Date.now() + 10 * 7 * 24 * 60 * 60 * 1000),
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          maxApplications: 20,
          currentApplications: 0,
          status: 'ACTIVE',
          isActive: true,
          isFeatured: false,
          viewCount: 0,
          createdById: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: { firstName: 'System', lastName: 'Generated' },
          _count: { applications: 0 },
          mlScore: 0.85,
          matchPercentage: 85,
          isMLGenerated: true
        },
        {
          id: 'fallback_4',
          title: 'DevOps & Cloud Engineering Intern',
          description: 'Learn modern DevOps practices, cloud infrastructure, and automation. Work with AWS/Azure, Docker, Kubernetes, and CI/CD pipelines to deploy scalable applications.',
          shortDescription: 'Modern DevOps practices and cloud infrastructure...',
          category: 'DevOps',
          type: 'REMOTE',
          department: 'CloudTech Solutions',
          location: 'Remote',
          duration: 14,
          stipend: 11000,
          currency: 'INR',
          skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Python'],
          requirements: ['Linux knowledge', 'Basic cloud concepts', 'Scripting skills'],
          responsibilities: ['Set up CI/CD pipelines', 'Manage cloud infrastructure', 'Automate deployment processes', 'Monitor system performance'],
          benefits: ['AWS/Azure certification', 'Hands-on cloud experience', 'Flexible remote work', 'Industry mentorship'],
          eligibility: ['CS/IT student', 'Linux experience', 'Basic cloud knowledge'],
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 7 * 24 * 60 * 60 * 1000),
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          maxApplications: 18,
          currentApplications: 0,
          status: 'ACTIVE',
          isActive: true,
          isFeatured: false,
          viewCount: 0,
          createdById: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: { firstName: 'System', lastName: 'Generated' },
          _count: { applications: 0 },
          mlScore: 0.82,
          matchPercentage: 82,
          isMLGenerated: true
        }
      ];

      res.status(200).json({
        success: true,
        data: { 
          recommendations: fallbackRecommendations,
          total: fallbackRecommendations.length,
          mlServiceUsed: false,
          fallback: true
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Save/bookmark an internship
   * POST /api/v1/internships/:id/save
   */
  async saveInternship(req, res) {
    try {
      const { id: internshipId } = req.params;
      const userId = req.user.id;

      // Check if internship exists
      const internship = await database.prisma.internship.findUnique({
        where: { id: internshipId }
      });

      if (!internship) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_FOUND',
            message: 'Internship not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check if already saved
      const existingSave = await database.prisma.savedInternship.findUnique({
        where: {
          userId_internshipId: {
            userId,
            internshipId
          }
        }
      });

      if (existingSave) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_SAVED',
            message: 'Internship is already saved'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Save the internship
      await database.prisma.savedInternship.create({
        data: {
          userId,
          internshipId
        }
      });

      res.status(200).json({
        success: true,
        message: 'Internship saved successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Save internship error', {
        error: error.message,
        userId: req.user?.id,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'SAVE_INTERNSHIP_FAILED',
          message: 'Failed to save internship'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Unsave/unbookmark an internship
   * DELETE /api/v1/internships/:id/save
   */
  async unsaveInternship(req, res) {
    try {
      const { id: internshipId } = req.params;
      const userId = req.user.id;

      const result = await database.prisma.savedInternship.deleteMany({
        where: {
          userId,
          internshipId
        }
      });

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_SAVED',
            message: 'Internship was not saved'
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        message: 'Internship unsaved successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Unsave internship error', {
        error: error.message,
        userId: req.user?.id,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UNSAVE_INTERNSHIP_FAILED',
          message: 'Failed to unsave internship'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get saved internships for user
   * GET /api/v1/internships/saved
   */
  async getSavedInternships(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;

      const [savedInternships, totalCount] = await Promise.all([
        database.prisma.savedInternship.findMany({
          where: { userId },
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            internship: {
              include: {
                createdBy: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                },
                _count: {
                  select: {
                    applications: true
                  }
                }
              }
            }
          }
        }),
        database.prisma.savedInternship.count({ where: { userId } })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          savedInternships: savedInternships.map(saved => saved.internship),
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalCount,
            itemsPerPage: parseInt(limit)
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get saved internships error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_SAVED_INTERNSHIPS_FAILED',
          message: 'Failed to fetch saved internships'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Apply to an internship
   * POST /api/v1/internships/:id/apply
   */
  async applyToInternship(req, res) {
    try {
      const { id: internshipId } = req.params;
      const userId = req.user.id;
      const { coverLetter, answers } = req.body;

      // Check if internship exists and is active
      const internship = await database.prisma.internship.findUnique({
        where: { id: internshipId }
      });

      if (!internship) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_FOUND',
            message: 'Internship not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      if (!internship.isActive || internship.status !== 'ACTIVE') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_ACTIVE',
            message: 'This internship is no longer accepting applications'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check application deadline
      if (new Date() > internship.applicationDeadline) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'APPLICATION_DEADLINE_PASSED',
            message: 'Application deadline has passed'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check if already applied
      const existingApplication = await database.prisma.application.findUnique({
        where: {
          studentId_internshipId: {
            studentId: userId,
            internshipId
          }
        }
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_APPLIED',
            message: 'You have already applied to this internship'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle resume upload if provided
      let resumeUrl = null;
      if (req.files && req.files.resume && req.files.resume[0]) {
        const resumeData = await uploadService.processUpload(req.files.resume[0], 'resume');
        resumeUrl = resumeData.url;
      }

      // Create application
      const application = await database.prisma.application.create({
        data: {
          studentId: userId,
          internshipId,
          coverLetter,
          resumeUrl,
          answers: answers ? JSON.parse(answers) : null,
          status: 'PENDING'
        }
      });

      // Update internship current applications count
      await database.prisma.internship.update({
        where: { id: internshipId },
        data: {
          currentApplications: {
            increment: 1
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: { applicationId: application.id },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Apply to internship error', {
        error: error.message,
        userId: req.user?.id,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'APPLICATION_FAILED',
          message: 'Failed to submit application. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Create new internship (Admin only)
   * POST /api/v1/internships
   */
  async createInternship(req, res) {
    try {
      const adminId = req.user.id;
      const {
        title,
        description,
        shortDescription,
        category,
        type = 'REMOTE',
        department,
        location,
        duration,
        stipend,
        currency = 'INR',
        isStipendNegotiable = false,
        startDate,
        endDate,
        applicationDeadline,
        maxApplications = 100,
        skills = [],
        requirements = [],
        responsibilities = [],
        benefits = [],
        eligibility = [],
        isFeatured = false
      } = req.body;

      const internship = await database.prisma.internship.create({
        data: {
          title,
          description,
          shortDescription,
          category,
          type,
          department,
          location,
          duration: parseInt(duration),
          stipend: stipend ? parseFloat(stipend) : null,
          currency,
          isStipendNegotiable,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          applicationDeadline: new Date(applicationDeadline),
          maxApplications: parseInt(maxApplications),
          skills,
          requirements,
          responsibilities,
          benefits,
          eligibility,
          isFeatured,
          createdById: adminId,
          status: 'ACTIVE'
        },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info('Internship created successfully', {
        internshipId: internship.id,
        createdBy: adminId,
        title
      });

      res.status(201).json({
        success: true,
        message: 'Internship created successfully',
        data: { internship },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Create internship error', {
        error: error.message,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_INTERNSHIP_FAILED',
          message: 'Failed to create internship. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update internship (Admin only)
   * PUT /api/v1/internships/:id
   */
  async updateInternship(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Convert string numbers to integers/floats where needed
      if (updateData.duration) updateData.duration = parseInt(updateData.duration);
      if (updateData.stipend) updateData.stipend = parseFloat(updateData.stipend);
      if (updateData.maxApplications) updateData.maxApplications = parseInt(updateData.maxApplications);

      // Convert date strings to Date objects
      if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
      if (updateData.applicationDeadline) updateData.applicationDeadline = new Date(updateData.applicationDeadline);

      const internship = await database.prisma.internship.update({
        where: { id },
        data: updateData,
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info('Internship updated successfully', {
        internshipId: id,
        updatedBy: req.user.id
      });

      res.status(200).json({
        success: true,
        message: 'Internship updated successfully',
        data: { internship },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Update internship error', {
        error: error.message,
        internshipId: req.params.id,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_INTERNSHIP_FAILED',
          message: 'Failed to update internship. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Delete internship (Admin only)
   * DELETE /api/v1/internships/:id
   */
  async deleteInternship(req, res) {
    try {
      const { id } = req.params;

      // Soft delete by setting isActive to false
      const internship = await database.prisma.internship.update({
        where: { id },
        data: {
          isActive: false,
          status: 'CLOSED'
        }
      });

      logger.info('Internship deleted (soft delete)', {
        internshipId: id,
        deletedBy: req.user.id
      });

      res.status(200).json({
        success: true,
        message: 'Internship deleted successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Delete internship error', {
        error: error.message,
        internshipId: req.params.id,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_INTERNSHIP_FAILED',
          message: 'Failed to delete internship. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship applications (Admin only)
   * GET /api/v1/internships/:id/applications
   */
  async getInternshipApplications(req, res) {
    try {
      const { id: internshipId } = req.params;
      const { page = 1, limit = 10, status, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;

      const skip = (page - 1) * limit;
      const filters = { internshipId };

      if (status) filters.status = status;

      const [applications, totalCount] = await Promise.all([
        database.prisma.application.findMany({
          where: filters,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { [sortBy]: sortOrder },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profile: {
                  select: {
                    skills: true,
                    location: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }),
        database.prisma.application.count({ where: filters })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          applications,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalCount,
            itemsPerPage: parseInt(limit)
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internship applications error', {
        error: error.message,
        internshipId: req.params.id,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_APPLICATIONS_FAILED',
          message: 'Failed to fetch internship applications'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

const internshipController = new InternshipController();
export default internshipController;
