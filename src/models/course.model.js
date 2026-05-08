'use strict';

const mongoose = require('mongoose');

/**
 * Course model to store certifications and courses completed.
 */
const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    platformName: {
      type: String,
      required: [true, 'Platform name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    certificate: {
      type: String, // URL/Path to certificate
      trim: true,
    },
    completionDate: {
      type: Date,
    },
    frontends: {
      type: [String],
      required: [true, 'At least one frontend is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A course must be associated with at least one frontend.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
courseSchema.index({ courseName: 'text', description: 'text' });
courseSchema.index({ frontends: 1 });
courseSchema.index({ completionDate: -1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
