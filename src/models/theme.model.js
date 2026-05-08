'use strict';

const mongoose = require('mongoose');

/**
 * Theme model to store dynamic design system tokens for a frontend.
 */
const themeSchema = new mongoose.Schema(
  {
    frontendSlug: {
      type: String,
      required: [true, 'Frontend slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    colors: {
      primary: { type: String, default: '#3b82f6' },
      secondary: { type: String, default: '#10b981' },
      accent: { type: String, default: '#f59e0b' },
      background: { type: String, default: '#ffffff' },
      surface: { type: String, default: '#f3f4f6' },
      text: { type: String, default: '#1f2937' },
      error: { type: String, default: '#ef4444' },
      success: { type: String, default: '#22c55e' },
    },
    fonts: {
      heading: { type: String, default: 'Inter, sans-serif' },
      body: { type: String, default: 'Roboto, sans-serif' },
      mono: { type: String, default: 'Fira Code, monospace' },
    },
    typography: {
      baseSize: { type: String, default: '16px' },
      h1Size: { type: String, default: '2.5rem' },
      h2Size: { type: String, default: '2rem' },
      fontWeight: { type: String, default: '400' },
      lineHeight: { type: String, default: '1.5' },
    },
    spacing: {
      unit: { type: String, default: '4px' },
      containerWidth: { type: String, default: '1200px' },
    },
    gradients: [
      {
        name: String,
        value: String, // CSS gradient string
      },
    ],
    mode: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light',
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

// ── Indexes ──────────────────────────────────────────────────────────────────

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
