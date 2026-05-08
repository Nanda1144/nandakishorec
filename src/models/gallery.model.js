'use strict';

const mongoose = require('mongoose');

/**
 * Gallery model to store images from various modules.
 */
const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['achievement', 'project', 'internship', 'other'],
      default: 'other',
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'type', // Dynamic reference based on type
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
gallerySchema.index({ frontends: 1 });
gallerySchema.index({ type: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
