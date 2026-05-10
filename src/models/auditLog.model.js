'use strict';

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: false, // Can be null for login attempts
    },
    action: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    request: {
      ip: String,
      device: String,
      browser: String,
      os: String,
      method: String,
      url: String,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
    errorMessage: String,
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
