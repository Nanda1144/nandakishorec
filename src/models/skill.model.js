'use strict';

const mongoose = require('mongoose');
const { SKILL_LEVELS } = require('../constants');

/**
 * Skill model to store technical proficiencies.
 */
const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      unique: true,
    },
    level: {
      type: String,
      enum: Object.values(SKILL_LEVELS),
      default: SKILL_LEVELS.BEGINNER,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    icon: {
      type: String, // URL/String
      trim: true,
    },
    frontends: {
      type: [String],
      required: [true, 'At least one frontend is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A skill must be associated with at least one frontend.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
skillSchema.index({ name: 'text' });
skillSchema.index({ frontends: 1 });
skillSchema.index({ category: 1 });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
