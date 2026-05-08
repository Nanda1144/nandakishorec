'use strict';

const mongoose = require('mongoose');

/**
 * Frontend model to manage different frontend instances/configurations.
 */
const frontendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Frontend name is required'],
      trim: true,
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    domainUrl: {
      type: String,
      required: [true, 'Domain URL is required'],
      trim: true,
      // Simple URL validation regex
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        'Please provide a valid domain URL',
      ],
    },
    logo: {
      type: String,
      trim: true,
    },
    themeSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
frontendSchema.index({ isActive: 1 });

const Frontend = mongoose.model('Frontend', frontendSchema);

module.exports = Frontend;
