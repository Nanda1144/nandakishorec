'use strict';

/**
 * Admin seeder — runs once at startup.
 *
 * Creates the single admin document if one does not already exist.
 * Credentials come from environment variables so they are never
 * hardcoded in source control.
 *
 * Required env vars:
 *   ADMIN_EMAIL   – e.g. admin@nandaportfolio
 *   ADMIN_PASSWORD – e.g. admin@portfolio
 *   ADMIN_PASSKEY  – e.g. admin@nandaportfolio
 *
 * The pre-save hooks in admin.model.js will bcrypt-hash the password
 * and passkey automatically before the document is written to MongoDB.
 */

const Admin = require('../models/admin.model');
const logger = require('./logger');

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const passkey = process.env.ADMIN_PASSKEY;

    if (!email || !password || !passkey) {
      logger.warn(
        'Skipping admin seed: ADMIN_EMAIL, ADMIN_PASSWORD, or ADMIN_PASSKEY not set in .env',
      );
      return;
    }

    const existing = await Admin.findOne({ email });

    if (existing) {
      logger.info(`Admin seed skipped — admin already exists: ${email}`);
      return;
    }

    // The pre-save hooks will hash password + passkey before insert
    await Admin.create({ email, password, passkey });

    logger.info(`✅ Admin seeded successfully: ${email}`);
  } catch (err) {
    logger.error(`Admin seed failed: ${err.message}`);
    // Non-fatal — server continues to run even if seed fails
  }
};

module.exports = seedAdmin;
