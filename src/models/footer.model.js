'use strict';

const mongoose = require('mongoose');

/**
 * Footer model for contact info and social presence.
 */
const footerSchema = new mongoose.Schema(
  {
    frontendSlug: {
      type: String,
      required: [true, 'Frontend slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String }, // e.g., FontAwesome class or URL
      },
    ],
    copyrightText: {
      type: String,
      default: 'All rights reserved.',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Footer = mongoose.model('Footer', footerSchema);

module.exports = Footer;
