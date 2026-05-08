'use strict';

const mongoose = require('mongoose');

/**
 * Hero Section model for dynamic homepage banners.
 */
const heroSchema = new mongoose.Schema(
  {
    frontendSlug: {
      type: String,
      required: [true, 'Frontend slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String, // URL
      trim: true,
    },
    backgroundImages: [
      {
        type: String, // URL
        trim: true,
      },
    ],
    ctaButtons: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        variant: { 
          type: String, 
          enum: ['primary', 'secondary', 'outline'], 
          default: 'primary' 
        },
      },
    ],
    animationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Hero = mongoose.model('Hero', heroSchema);

module.exports = Hero;
