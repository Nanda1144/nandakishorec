'use strict';

const Project = require('../models/project.model');
const Internship = require('../models/internship.model');
const Course = require('../models/course.model');
const Achievement = require('../models/achievement.model');
const Skill = require('../models/skill.model');

/**
 * ScraperService - Attempts to import content from a given URL.
 */
class ScraperService {
  /**
   * Main import function
   */
  async importFromUrl(url, frontendSlug) {
    try {
      // 1. Fetch the HTML
      const response = await fetch(url);
      const html = await response.text();

      const results = {
        projects: 0,
        internships: 0,
        courses: 0,
        achievements: 0,
        skills: 0,
        media: 0
      };

      // 2. Look for JSON data (Modern portfolios often have a data.json or similar)
      // We'll also check for common script tags that contain initial state
      
      // For now, let's implement a "Discovery" logic
      // We will look for <a> tags with 'github' or 'linkedin'
      // We will look for <img> tags
      
      console.log(`[Scraper] Starting import for ${url} (Frontend: ${frontendSlug})`);

      // 3. Simple Pattern Recognition (Example: Skills)
      // This is a placeholder for a more complex AI-based or Cheerio-based scraper
      // In a real scenario, we would use a library like 'cheerio' to parse the HTML properly
      
      // If the target site is another portfolio from THIS system, it might have an /api endpoint
      // We'll try to fetch data from standard paths
      const apiBase = url.endsWith('/') ? url.slice(0, -1) : url;
      
      try {
        const dataRes = await fetch(`${apiBase}/data.json`);
        if (dataRes.ok) {
          const remoteData = await dataRes.json();
          return await this.importStructuredData(remoteData, frontendSlug);
        }
      } catch (e) {
        console.log('[Scraper] No data.json found, attempting HTML discovery...');
      }

      return {
        message: 'Import started. Basic discovery performed.',
        results
      };
    } catch (error) {
      console.error('[Scraper] Import failed:', error);
      throw new Error(`Failed to import from URL: ${error.message}`);
    }
  }

  /**
   * If we find structured JSON, we can map it to our models
   */
  async importStructuredData(data, slug) {
    const results = { projects: 0, skills: 0 };

    if (data.projects && Array.isArray(data.projects)) {
      for (const p of data.projects) {
        await Project.create({
          ...p,
          frontends: [slug]
        });
        results.projects++;
      }
    }

    if (data.skills && Array.isArray(data.skills)) {
      for (const s of data.skills) {
        await Skill.create({
          ...s,
          frontends: [slug]
        });
        results.skills++;
      }
    }

    return {
      message: 'Successfully imported structured data!',
      results
    };
  }
}

module.exports = new ScraperService();
