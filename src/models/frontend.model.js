'use strict';

const mongoose = require('mongoose');

/**
 * Frontend model to manage different frontend instances/configurations.
 */
const frontendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Frontend name is required'],
      trim: true,
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    url: {
      type: String,
      required: [true, 'Frontend URL is required'],
      trim: true,
    },
    frontendType: {
      type: String,
      required: [true, 'Frontend type is required'],
      enum: ['Personal', 'Business', 'Portfolio', 'Other'],
      default: 'Portfolio',
    },
    theme: {
      type: String,
      required: [true, 'Theme is required'],
      default: 'Modern Dark',
    },
    status: {
      type: String,
      enum: ['Active', 'Maintenance', 'Draft'],
      default: 'Active',
    },
    draftConfig: {
      type: Object,
      default: {},
    },
    publishedConfig: {
      type: Object,
      default: {},
    },
    revisions: [
      {
        config: Object,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    logo: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Pre-save Hook to generate slug ──────────────────────────────────────────
frontendSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_]+/g, '-')   // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, '');  // Trim hyphens
  }
  next();
});

// ── Indexes ──────────────────────────────────────────────────────────────────
frontendSchema.index({ slug: 1 }, { unique: true });
frontendSchema.index({ isActive: 1 });

const Frontend = mongoose.model('Frontend', frontendSchema);

module.exports = Frontend;
