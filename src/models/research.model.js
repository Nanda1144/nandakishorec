'use strict';

const mongoose = require('mongoose');

/**
 * Research model to store academic publications and papers.
 */
const researchSchema = new mongoose.Schema(
  {
    isEnabled: {
      type: Boolean,
      default: true,
    },
    researchTitle: {
      type: String,
      required: [true, 'Research title is required'],
      trim: true,
    },
    researchName: {
      type: String,
      trim: true,
    },
    authors: [
      {
        type: String,
        trim: true,
      },
    ],
    journalName: {
      type: String,
      trim: true,
    },
    researchLink: {
      type: String,
      trim: true,
    },
    researchId: {
      type: String,
      trim: true,
    },
    DOI: {
      type: String,
      trim: true,
    },
    certificate: {
      type: String, // URL/Path to certificate
      trim: true,
    },
    publicationDate: {
      type: Date,
      required: [true, 'Publication date is required'],
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
researchSchema.index({ researchTitle: 'text', journalName: 'text' });
researchSchema.index({ frontends: 1 });
researchSchema.index({ isEnabled: 1 });

const Research = mongoose.model('Research', researchSchema);

module.exports = Research;
