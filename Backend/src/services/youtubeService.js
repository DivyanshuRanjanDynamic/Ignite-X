/**
 * YouTube Integration Service
 * Provides curated YouTube links for skill learning
 */

import logger from '../config/logger.js';

/**
 * YouTube Service
 * Manages YouTube links for skill learning
 */
export class YouTubeService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    
    // Curated fallback links for common skills
    this.curatedLinks = {
      'JavaScript': {
        videoId: 'hdI2bqOjy3c',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'JavaScript Crash Course for Beginners',
        channel: 'freeCodeCamp.org'
      },
      'Python': {
        videoId: 'kqtD5dpn9C8',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'Python for Beginners - Full Course',
        channel: 'freeCodeCamp.org'
      },
      'Java': {
        videoId: 'grEKMHGYyns',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'Java Programming Full Course',
        channel: 'freeCodeCamp.org'
      },
      'C++': {
        videoId: 'vLnP7ZdRkRg',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'C++ Programming Course for Beginners',
        channel: 'freeCodeCamp.org'
      },
      'SQL': {
        videoId: 'HXV3zeQKqGY',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'SQL Tutorial - Full Database Course for Beginners',
        channel: 'freeCodeCamp.org'
      },
      'Git': {
        videoId: 'RGOj5yH7evk',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'Git and GitHub for Beginners - Crash Course',
        channel: 'freeCodeCamp.org'
      },
      'Docker': {
        videoId: 'pTFZFxd4hOI',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'Docker Tutorial for Beginners',
        channel: 'freeCodeCamp.org'
      },
      'AWS': {
        videoId: 'SOTamWNgDKc',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'AWS Tutorial for Beginners',
        channel: 'freeCodeCamp.org'
      },
      'Machine Learning': {
        videoId: 'i_LwzRVP7bg',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'Machine Learning Course for Beginners',
        channel: 'freeCodeCamp.org'
      },
      'Data Analysis': {
        videoId: 'ua-CiDNNj30',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'Data Analysis with Python - Full Course',
        channel: 'freeCodeCamp.org'
      },
      'React': {
        videoId: 'bMknfKXIFA8',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'React Course for Beginners',
        channel: 'freeCodeCamp.org'
      },
      'Node.js': {
        videoId: 'Oe421EPjeBE',
        channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
        title: 'Node.js and Express.js - Full Course',
        channel: 'freeCodeCamp.org'
      }
    };
  }

  /**
   * Get YouTube link for a skill
   * @param {string} skill - Skill name
   * @returns {Promise<Object>} YouTube link information
   */
  async getTopYouTubeForSkill(skill) {
    try {
      // Try to get from curated links first
      const curatedLink = this.curatedLinks[skill];
      if (curatedLink) {
        return {
          skill,
          videoId: curatedLink.videoId,
          channelId: curatedLink.channelId,
          title: curatedLink.title,
          channel: curatedLink.channel,
          url: `https://www.youtube.com/watch?v=${curatedLink.videoId}`,
          channelUrl: `https://www.youtube.com/channel/${curatedLink.channelId}`,
          source: 'curated',
          timestamp: new Date().toISOString()
        };
      }

      // If no curated link, try YouTube API
      if (this.apiKey) {
        return await this.searchYouTubeAPI(skill);
      }

      // Fallback to generic programming tutorial
      return this.getFallbackLink(skill);
    } catch (error) {
      logger.error('Failed to get YouTube link for skill', {
        skill,
        error: error.message
      });
      return this.getFallbackLink(skill);
    }
  }

  /**
   * Search YouTube API for skill-related videos
   * @param {string} skill - Skill name
   * @returns {Promise<Object>} YouTube search result
   */
  async searchYouTubeAPI(skill) {
    try {
      const searchQuery = `${skill} tutorial programming`;
      const url = `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryId=28&maxResults=1&key=${this.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return {
          skill,
          videoId: video.id.videoId,
          channelId: video.snippet.channelId,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          channelUrl: `https://www.youtube.com/channel/${video.snippet.channelId}`,
          source: 'youtube-api',
          timestamp: new Date().toISOString()
        };
      }

      return this.getFallbackLink(skill);
    } catch (error) {
      logger.error('YouTube API search failed', {
        skill,
        error: error.message
      });
      return this.getFallbackLink(skill);
    }
  }

  /**
   * Get fallback link for unknown skills
   * @param {string} skill - Skill name
   * @returns {Object} Fallback link
   */
  getFallbackLink(skill) {
    return {
      skill,
      videoId: 'kqtD5dpn9C8', // Python tutorial as fallback
      channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
      title: `Learn ${skill} - Programming Tutorial`,
      channel: 'freeCodeCamp.org',
      url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
      channelUrl: 'https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ',
      source: 'fallback',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get multiple YouTube links for skills
   * @param {Array} skills - Array of skill names
   * @returns {Promise<Array>} Array of YouTube link objects
   */
  async getYouTubeLinksForSkills(skills) {
    try {
      const promises = skills.map(skill => this.getTopYouTubeForSkill(skill));
      const results = await Promise.all(promises);
      
      logger.info('Retrieved YouTube links for skills', {
        skillCount: skills.length,
        resultsCount: results.length
      });
      
      return results;
    } catch (error) {
      logger.error('Failed to get YouTube links for skills', {
        skills,
        error: error.message
      });
      return [];
    }
  }

  /**
   * Get curated skills with YouTube links
   * @returns {Object} Curated skills mapping
   */
  getCuratedSkills() {
    return { ...this.curatedLinks };
  }

  /**
   * Add or update curated link for a skill
   * @param {string} skill - Skill name
   * @param {Object} linkData - Link data
   */
  addCuratedLink(skill, linkData) {
    this.curatedLinks[skill] = {
      videoId: linkData.videoId,
      channelId: linkData.channelId,
      title: linkData.title,
      channel: linkData.channel
    };
    
    logger.info('Added curated YouTube link', { skill, linkData });
  }

  /**
   * Get service health status
   * @returns {Object} Health status
   */
  getHealth() {
    return {
      status: 'healthy',
      hasApiKey: !!this.apiKey,
      curatedLinksCount: Object.keys(this.curatedLinks).length,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const youtubeService = new YouTubeService();
export default youtubeService;
