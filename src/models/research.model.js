'use strict';

const mongoose = require('mongoose');
const gdrive = require('../utils/googleDrive');

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
      url: { type: String, trim: true },
      previewUrl: { type: String, trim: true },
      downloadUrl: { type: String, trim: true },
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

// ── Pre-save hook ─────────────────────────────────────────────────────────────
researchSchema.pre('save', function (next) {
  if (this.certificate && this.certificate.url && gdrive.isGoogleDriveLink(this.certificate.url)) {
    this.certificate.previewUrl = gdrive.getPreviewLink(this.certificate.url);
    this.certificate.downloadUrl = gdrive.getDownloadLink(this.certificate.url);
  }
  next();
});

// ── Indexes ──────────────────────────────────────────────────────────────────
researchSchema.index({ researchTitle: 'text', journalName: 'text' });
researchSchema.index({ frontends: 1 });
researchSchema.index({ isEnabled: 1 });

const Research = mongoose.model('Research', researchSchema);

module.exports = Research;
