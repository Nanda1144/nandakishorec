'use strict';

const mongoose = require('mongoose');
const gdrive = require('../utils/googleDrive');

/**
 * Internship / Work Experience model.
 */
const internshipSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    domainName: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    offerLetter: {
      url: { type: String, trim: true },
      previewUrl: { type: String, trim: true },
      downloadUrl: { type: String, trim: true },
    },
    completionCertificate: {
      url: { type: String, trim: true },
      previewUrl: { type: String, trim: true },
      downloadUrl: { type: String, trim: true },
    },
    photos: [
      {
        type: String, // URL/Path to photos
        trim: true,
      },
    ],
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    responsibilities: {
      type: String,
      trim: true,
    },
    technologiesUsed: [
      {
        type: String,
        trim: true,
      },
    ],
    frontends: {
      type: [String],
      required: [true, 'At least one frontend is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one frontend must be associated.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Pre-save hook ─────────────────────────────────────────────────────────────
internshipSchema.pre('save', function (next) {
  const processGDrive = (field) => {
    if (this[field] && this[field].url && gdrive.isGoogleDriveLink(this[field].url)) {
      this[field].previewUrl = gdrive.getPreviewLink(this[field].url);
      this[field].downloadUrl = gdrive.getDownloadLink(this[field].url);
    }
  };

  processGDrive('offerLetter');
  processGDrive('completionCertificate');
  next();
});

// ── Indexes ──────────────────────────────────────────────────────────────────
internshipSchema.index({ companyName: 'text', description: 'text' });
internshipSchema.index({ frontends: 1 });
internshipSchema.index({ startDate: -1 });

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;
