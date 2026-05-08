'use strict';

const Theme = require('../models/theme.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');

/**
 * ThemeService — business logic for Theme management.
 */
class ThemeService {
  /**
   * Get theme by frontend slug.
   * Creates a default theme if none exists.
   */
  async getThemeByFrontend(frontendSlug) {
    let theme = await Theme.findOne({ frontendSlug }).lean();
    
    // If no theme exists for this frontend, we could return a default or create one
    if (!theme) {
      theme = await Theme.create({ frontendSlug });
    }
    
    return theme;
  }

  /**
   * Update theme for a specific frontend.
   */
  async updateTheme(frontendSlug, payload) {
    const theme = await Theme.findOneAndUpdate(
      { frontendSlug },
      payload,
      { new: true, runValidators: true, upsert: true }
    ).lean();
    
    return theme;
  }

  /**
   * Reset theme to defaults.
   */
  async resetTheme(frontendSlug) {
    await Theme.deleteOne({ frontendSlug });
    return await this.getThemeByFrontend(frontendSlug);
  }
}

module.exports = new ThemeService();
