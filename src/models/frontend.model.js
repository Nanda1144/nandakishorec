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
    url: {
      type: String,
      required: [true, 'Frontend URL is required'],
      trim: true,
    },
    frontendType: {
      type: String,
      required: [true, 'Frontend type is required'],
      enum: ['Personal', 'Business', 'Portfolio', 'Other'],
      default: 'Portfolio',
    },
    theme: {
      type: String,
      required: [true, 'Theme is required'],
      default: 'Modern Dark',
    },
    status: {
      type: String,
      enum: ['Active', 'Maintenance', 'Draft'],
      default: 'Active',
    },
    logo: {
      type: String,
      trim: true,
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
