'use strict';

const mongoose = require('mongoose');

/**
 * Header model for dynamic navigation and branding.
 */
const headerSchema = new mongoose.Schema(
  {
    frontendSlug: {
      type: String,
      required: [true, 'Frontend slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String, // URL
      trim: true,
    },
    navLinks: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        isExternal: { type: Boolean, default: false },
      },
    ],
    externalFrontendLinks: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    headerImages: [
      { type: String, trim: true } // URLs
    ],
    socialLinks: [
      {
        platform: { type: String },
        url: { type: String },
        icon: { type: String }
      }
    ],
    contactDetails: {
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true }
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Header = mongoose.model('Header', headerSchema);

module.exports = Header;
