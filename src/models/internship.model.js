'use strict';

const mongoose = require('mongoose');

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
      type: String, // URL/Path to file
      trim: true,
    },
    completionCertificate: {
      type: String, // URL/Path to file
      trim: true,
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

// ── Indexes ──────────────────────────────────────────────────────────────────
internshipSchema.index({ companyName: 'text', description: 'text' });
internshipSchema.index({ frontends: 1 });
internshipSchema.index({ startDate: -1 });

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;
