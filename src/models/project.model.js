'use strict';

const mongoose = require('mongoose');
const { PROJECT_STATUS } = require('../constants');

/**
 * Project model to store portfolio project details.
 */
const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name must not exceed 100 characters'],
    },
    skillsUsed: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    projectLink: {
      type: String,
      trim: true,
    },
    githubLink: {
      type: String,
      trim: true,
    },
    projectLogo: {
      type: String,
      trim: true,
    },
    screenshots: [
      {
        type: String,
        trim: true,
      },
    ],
    deploymentLink: {
      type: String,
      trim: true,
    },
    teamMembers: [
      {
        name: String,
        role: String,
        github: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      trim: true,
    },
    projectStatus: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    frontends: {
      type: [String],
      required: [true, 'Frontend selection is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A project must be associated with at least one frontend.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
projectSchema.index({ projectName: 'text', description: 'text' }); // For search
projectSchema.index({ frontends: 1 }); // For filtering by frontend
projectSchema.index({ featured: 1 });
projectSchema.index({ category: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
