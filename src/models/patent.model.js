'use strict';

const mongoose = require('mongoose');
const gdrive = require('../utils/googleDrive');

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
      url: { type: String, trim: true },
      previewUrl: { type: String, trim: true },
      downloadUrl: { type: String, trim: true },
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
patentSchema.pre('save', function (next) {
  if (this.certificate && this.certificate.url && gdrive.isGoogleDriveLink(this.certificate.url)) {
    this.certificate.previewUrl = gdrive.getPreviewLink(this.certificate.url);
    this.certificate.downloadUrl = gdrive.getDownloadLink(this.certificate.url);
  }
  next();
});

// ── Indexes ──────────────────────────────────────────────────────────────────
patentSchema.index({ patentTitle: 'text', description: 'text' });
patentSchema.index({ frontends: 1 });
patentSchema.index({ isEnabled: 1 });

const Patent = mongoose.model('Patent', patentSchema);

module.exports = Patent;
