'use strict';

const mongoose = require('mongoose');

/**
 * Achievement model to store awards and milestones.
 */
const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    photos: [
      {
        type: String,
        trim: true,
      },
    ],
    certificate: {
      type: String,
      trim: true,
    },
    achievementDate: {
      type: Date,
      required: [true, 'Achievement date is required'],
    },
    frontends: {
      type: [String],
      required: [true, 'At least one frontend is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'An achievement must be associated with at least one frontend.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
achievementSchema.index({ title: 'text', description: 'text' });
achievementSchema.index({ frontends: 1 });
achievementSchema.index({ achievementDate: -1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
