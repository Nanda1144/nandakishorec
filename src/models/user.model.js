'use strict';

const mongoose = require('mongoose');

/**
 * Example User model.
 * Replace / extend this as needed for your domain.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,   // Adds createdAt and updatedAt
    versionKey: false,  // Removes __v field
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// Note: email index is created automatically by `unique: true` above.
// Add compound indexes here for query-heavy fields.
userSchema.index({ isActive: 1, role: 1 }); // Efficient for admin user-list queries

// ── Instance methods ──────────────────────────────────────────────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
