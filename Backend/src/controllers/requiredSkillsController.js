/**
 * Required Skills Controller
 * Manages skill recommendations, keyword extraction, and YouTube learning links
 */

import database from '../config/database.js';
import logger from '../config/logger.js';
import youtubeService from '../services/youtubeService.js';
import featureFlagService from '../services/featureFlagService.js';
import atsAdapter from '../adapters/atsAdapter.js';

class RequiredSkillsController {
  /**
   * Get required skills for user
   * GET /api/v1/required-skills
   */
  async getRequiredSkills(req, res) {
    try {
      const userId = req.user.id;

      // Check feature flag
      if (!req.featureFlags.isEnabled('resume_v2')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: 'Resume V2 feature is not enabled'
          }
        });
      }

      // Get user's latest resume with ATS scores
      const latestResume = await database.prisma.resume.findFirst({
        where: {
          userId,
          isActive: true,
          atsStatus: 'COMPLETED'
        },
        orderBy: {
          uploadedAt: 'desc'
        }
      });

      if (!latestResume || !latestResume.skillScores) {
        return res.json({
          success: true,
          data: {
            skills: [],
            message: 'No ATS analysis available. Upload a resume to get skill recommendations.'
          }
        });
      }

      // Find weak skills (score < 90)
      const weakSkills = Object.entries(latestResume.skillScores)
        .filter(([_, score]) => score < 90)
        .map(([skill, score]) => ({
          skill,
          currentScore: score,
          targetScore: 90,
          proficiency: this.getProficiencyLevel(score),
          description: this.getSkillDescription(skill)
        }));

      // Get YouTube links for weak skills
      const youtubeLinks = await youtubeService.getYouTubeLinksForSkills(
        weakSkills.map(ws => ws.skill)
      );

      // Combine skills with YouTube links
      const skillsWithLinks = weakSkills.map(skill => {
        const youtubeLink = youtubeLinks.find(link => link.skill === skill.skill);
        return {
          ...skill,
          youtubeLink: youtubeLink || null
        };
      });

      logger.info('Required skills retrieved', {
        userId,
        weakSkillsCount: weakSkills.length,
        totalSkillsAnalyzed: Object.keys(latestResume.skillScores).length
      });

      res.json({
        success: true,
        data: {
          skills: skillsWithLinks,
          totalAnalyzed: Object.keys(latestResume.skillScores).length,
          weakSkillsCount: weakSkills.length,
          lastAnalyzed: latestResume.uploadedAt
        }
      });

    } catch (error) {
      logger.error('Failed to get required skills', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'REQUIRED_SKILLS_FAILED',
          message: 'Failed to get required skills'
        }
      });
    }
  }

  /**
   * Get skill learning progress
   * GET /api/v2/required-skills/progress
   */
  async getSkillProgress(req, res) {
    try {
      const userId = req.user.id;

      // Check feature flag
      if (!req.featureFlags.isEnabled('resume_v2')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: 'Resume V2 feature is not enabled'
          }
        });
      }

      // Get user's resume history to track progress
      const resumes = await database.prisma.resume.findMany({
        where: {
          userId,
          isActive: true,
          atsStatus: 'COMPLETED'
        },
        orderBy: {
          uploadedAt: 'desc'
        },
        take: 5 // Last 5 resumes
      });

      if (resumes.length === 0) {
        return res.json({
          success: true,
          data: {
            progress: [],
            message: 'No resume history available'
          }
        });
      }

      // Calculate skill improvement over time
      const progress = this.calculateSkillProgress(resumes);

      res.json({
        success: true,
        data: {
          progress,
          totalResumes: resumes.length,
          timeRange: {
            from: resumes[resumes.length - 1].uploadedAt,
            to: resumes[0].uploadedAt
          }
        }
      });

    } catch (error) {
      logger.error('Failed to get skill progress', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'SKILL_PROGRESS_FAILED',
          message: 'Failed to get skill progress'
        }
      });
    }
  }

  /**
   * Get proficiency level from score
   * @param {number} score - Skill score (0-100)
   * @returns {string} Proficiency level
   */
  getProficiencyLevel(score) {
    if (score >= 90) return 'Expert';
    if (score >= 70) return 'Intermediate';
    if (score >= 50) return 'Beginner';
    return 'Novice';
  }

  /**
   * Get skill description
   * @param {string} skill - Skill name
   * @returns {string} Skill description
   */
  getSkillDescription(skill) {
    const descriptions = {
      'JavaScript': 'A versatile programming language for web development, used for both frontend and backend applications.',
      'Python': 'A high-level programming language known for its simplicity and versatility in data science, web development, and automation.',
      'Java': 'A robust, object-oriented programming language widely used in enterprise applications and Android development.',
      'C++': 'A powerful programming language used for system programming, game development, and performance-critical applications.',
      'SQL': 'Structured Query Language for managing and manipulating relational databases.',
      'Git': 'A distributed version control system for tracking changes in source code during software development.',
      'Docker': 'A containerization platform that enables developers to package applications and their dependencies.',
      'AWS': 'Amazon Web Services, a comprehensive cloud computing platform offering various services.',
      'Machine Learning': 'A subset of artificial intelligence that enables computers to learn and make decisions from data.',
      'Data Analysis': 'The process of inspecting, cleaning, and modeling data to discover useful information and support decision-making.',
      'React': 'A JavaScript library for building user interfaces, particularly single-page applications.',
      'Node.js': 'A JavaScript runtime built on Chrome\'s V8 engine for building scalable network applications.'
    };

    return descriptions[skill] || `Learn ${skill} to improve your resume and career prospects.`;
  }

  /**
   * Calculate skill progress over time
   * @param {Array} resumes - Array of resume objects
   * @returns {Array} Progress data
   */
  calculateSkillProgress(resumes) {
    if (resumes.length < 2) return [];

    const progress = [];
    const allSkills = new Set();

    // Collect all skills from all resumes
    resumes.forEach(resume => {
      if (resume.skillScores) {
        Object.keys(resume.skillScores).forEach(skill => allSkills.add(skill));
      }
    });

    // Calculate progress for each skill
    allSkills.forEach(skill => {
      const skillProgress = resumes.map(resume => ({
        date: resume.uploadedAt,
        score: resume.skillScores?.[skill] || 0
      })).filter(item => item.score > 0);

      if (skillProgress.length > 1) {
        const firstScore = skillProgress[skillProgress.length - 1].score;
        const latestScore = skillProgress[0].score;
        const improvement = latestScore - firstScore;

        progress.push({
          skill,
          firstScore,
          latestScore,
          improvement,
          progress: skillProgress,
          trend: improvement > 0 ? 'improving' : improvement < 0 ? 'declining' : 'stable'
        });
      }
    });

    return progress.sort((a, b) => Math.abs(b.improvement) - Math.abs(a.improvement));
  }

  /**
   * Extract keywords from resume text
   * POST /api/v1/required-skills/extract-keywords
   */
  async extractKeywords(req, res) {
    try {
      const userId = req.user.id;
      const { text, resumeId } = req.body;

      // Check feature flag
      if (!req.featureFlags.isEnabled('resume_v2')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: 'Resume V2 feature is not enabled'
          }
        });
      }

      if (!text && !resumeId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'Either text or resumeId must be provided'
          }
        });
      }

      let resumeText = text;

      // If resumeId is provided, get the text from the database
      if (!text && resumeId) {
        const resume = await database.prisma.resume.findFirst({
          where: {
            id: resumeId,
            userId,
            isActive: true
          }
        });

        if (!resume) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'RESUME_NOT_FOUND',
              message: 'Resume not found'
            }
          });
        }

        resumeText = resume.extractedText;

        if (!resumeText) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'NO_TEXT_AVAILABLE',
              message: 'No extracted text available for this resume'
            }
          });
        }
      }

      // Extract skills using ATS adapter
      const extractedSkills = await atsAdapter.extractSkills(resumeText);

      // Get user profile for context
      const userProfile = await this.getUserProfile(userId);

      // Get skill descriptions
      const skillsWithDetails = extractedSkills.map(skill => ({
        skill,
        description: this.getSkillDescription(skill),
        relevance: this.calculateSkillRelevance(skill, userProfile)
      }));

      // Sort by relevance
      const sortedSkills = skillsWithDetails.sort((a, b) => b.relevance - a.relevance);

      logger.info('Keywords extracted from resume', {
        userId,
        resumeId: resumeId || 'direct-text',
        skillCount: extractedSkills.length
      });

      res.json({
        success: true,
        data: {
          skills: sortedSkills,
          count: sortedSkills.length
        }
      });

    } catch (error) {
      logger.error('Failed to extract keywords', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'EXTRACTION_FAILED',
          message: 'Failed to extract keywords from resume'
        }
      });
    }
  }

  /**
   * Calculate skill relevance based on user profile
   * @param {string} skill - Skill name
   * @param {Object} userProfile - User profile data
   * @returns {number} Relevance score (0-100)
   */
  calculateSkillRelevance(skill, userProfile) {
    // Base relevance
    let relevance = 70;

    // Boost relevance if skill is in user's preferred skills
    if (userProfile.skills && userProfile.skills.includes(skill)) {
      relevance += 20;
    }

    // Boost relevance if skill is related to user's experience
    if (userProfile.experience && userProfile.experience.length > 0) {
      const experienceText = userProfile.experience
        .map(exp => `${exp.title} ${exp.company} ${exp.description || ''}`)
        .join(' ')
        .toLowerCase();

      if (experienceText.includes(skill.toLowerCase())) {
        relevance += 10;
      }
    }

    return Math.min(100, relevance);
  }

  /**
   * Get user profile for context
   * @param {string} userId - User ID
   * @returns {Object} User profile data
   */
  async getUserProfile(userId) {
    try {
      const user = await database.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              education: true,
              experience: true
            }
          }
        }
      });

      if (!user) return {};

      return {
        skills: user.profile?.skills || [],
        interests: user.profile?.interests || [],
        education: user.profile?.education || [],
        experience: user.profile?.experience || [],
        location: user.profile?.location
      };
    } catch (error) {
      logger.error('Failed to get user profile for keyword extraction', {
        userId,
        error: error.message
      });
      return {};
    }
  }

  /**
   * Get skill description from skill database or generate one
   * @param {string} skill - Skill name
   * @returns {string} Skill description
   */
  getSkillDescription(skill) {
    // Common skills with descriptions
    const skillDescriptions = {
      'javascript': 'A programming language that enables interactive web pages and is an essential part of web applications.',
      'python': 'A high-level programming language known for its readability and versatility in web development, data science, and AI.',
      'java': 'A class-based, object-oriented programming language designed for portability and cross-platform development.',
      'react': 'A JavaScript library for building user interfaces, particularly single-page applications.',
      'node.js': 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine for building scalable network applications.',
      'html': 'The standard markup language for documents designed to be displayed in a web browser.',
      'css': 'A style sheet language used for describing the presentation of a document written in HTML.',
      'sql': 'A domain-specific language used for managing data in relational database management systems.',
      'aws': 'Amazon Web Services, a cloud computing platform providing on-demand computing resources.',
      'docker': 'A platform for developing, shipping, and running applications in containers.',
      'kubernetes': 'An open-source system for automating deployment, scaling, and management of containerized applications.',
      'git': 'A distributed version control system for tracking changes in source code during software development.',
      'agile': 'A project management approach that involves breaking projects into phases and emphasizes continuous improvement.',
      'machine learning': 'A field of AI that enables systems to learn and improve from experience without being explicitly programmed.',
      'data analysis': 'The process of inspecting, cleansing, transforming, and modeling data to discover useful information.',
      'project management': 'The practice of leading the work of a team to achieve goals and meet success criteria at the specified time.',
      'communication': 'The ability to convey information effectively and efficiently in professional settings.',
      'leadership': 'The ability to guide, influence, and inspire others to achieve a common goal.',
      'problem solving': 'The process of finding solutions to difficult or complex issues.',
      'teamwork': 'The collaborative effort of a group to achieve a common goal efficiently and effectively.'
    };

    // Check if we have a predefined description
    const normalizedSkill = skill.toLowerCase();
    if (skillDescriptions[normalizedSkill]) {
      return skillDescriptions[normalizedSkill];
    }

    // Generate a generic description for unknown skills
    return `${skill} is a valuable skill in professional environments that can enhance productivity and career opportunities.`;
  }
}

export default new RequiredSkillsController();
