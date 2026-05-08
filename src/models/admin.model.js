'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin model.
 * Single-admin system — only one document should ever exist.
 *
 * Security fields:
 *   failedAttempts  – incremented on each bad password
 *   lockUntil       – Date after which the account is accessible again
 *   refreshTokens   – array of hashed refresh tokens (supports multi-device)
 *   passkey         – hashed unlock passkey (for account recovery)
 */
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },

    passkey: {
      type: String,
      required: [true, 'Passkey is required'],
      select: false,
    },

    // ── Brute-force / lockout tracking ───────────────────────────────────────
    failedAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    // ── Refresh token rotation ───────────────────────────────────────────────
    // Stores an array of { tokenHash, createdAt } so multiple
    // devices / sessions can stay logged in simultaneously.
    refreshTokens: {
      type: [
        {
          tokenHash: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Virtual ───────────────────────────────────────────────────────────────────
adminSchema.virtual('isLocked').get(function () {
  return this.lockUntil !== null && this.lockUntil > Date.now();
});

// ── Pre-save hooks ────────────────────────────────────────────────────────────

/** Hash password before save (only when modified) */
adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

/** Hash passkey before save (only when modified) */
adminSchema.pre('save', async function (next) {
  if (this.isModified('passkey')) {
    this.passkey = await bcrypt.hash(this.passkey, 12);
  }
  next();
});

// ── Instance methods ──────────────────────────────────────────────────────────

/** Compare plain password against stored hash */
adminSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

/** Compare plain passkey against stored hash */
adminSchema.methods.comparePasskey = async function (plain) {
  return bcrypt.compare(plain, this.passkey);
};

/** Remove expired refresh tokens (older than 7 days) */
adminSchema.methods.purgeExpiredTokens = function () {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  this.refreshTokens = this.refreshTokens.filter((t) => t.createdAt > cutoff);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
