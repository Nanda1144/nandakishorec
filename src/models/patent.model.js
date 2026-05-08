'use strict';

const mongoose = require('mongoose');

/**
 * Patent model to store intellectual property details.
 */
const patentSchema = new mongoose.Schema(
  {
    isEnabled: {
      type: Boolean,
      default: true,
    },
    patentTitle: {
      type: String,
      required: [true, 'Patent title is required'],
      trim: true,
    },
    patentId: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    driveLinks: [
      {
        type: String,
        trim: true,
      },
    ],
    certificate: {
      type: String, // URL/Path to certificate
      trim: true,
    },
    frontends: {
      type: [String],
      required: [true, 'At least one frontend is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
patentSchema.index({ patentTitle: 'text', description: 'text' });
patentSchema.index({ frontends: 1 });
patentSchema.index({ isEnabled: 1 });

const Patent = mongoose.model('Patent', patentSchema);

module.exports = Patent;
