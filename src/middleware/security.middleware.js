'use strict';

const useragent = require('useragent');
const requestIp = require('request-ip');
const AuditLog = require('../models/auditLog.model');

/**
 * Middleware to attach client info (IP, Device, Browser) to the request object.
 */
const clientInfo = (req, res, next) => {
  const clientIp = requestIp.getClientIp(req);
  const agent = useragent.parse(req.headers['user-agent']);
  
  req.clientInfo = {
    ip: clientIp,
    browser: agent.toAgent(),
    os: agent.os.toString(),
    device: agent.device.toString(),
  };
  
  next();
};

/**
 * Utility to log audit events.
 */
const logAudit = async ({ adminId, action, entity, entityId, oldValue, newValue, req, status, errorMessage }) => {
  try {
    await AuditLog.create({
      admin: adminId,
      action,
      entity,
      entityId,
      oldValue,
      newValue,
      request: {
        ip: req?.clientInfo?.ip || 'unknown',
        device: req?.clientInfo?.device || 'unknown',
        browser: req?.clientInfo?.browser || 'unknown',
        os: req?.clientInfo?.os || 'unknown',
        method: req?.method,
        url: req?.originalUrl,
      },
      status: status || 'success',
      errorMessage,
    });
  } catch (err) {
    console.error('Audit Log Error:', err.message);
  }
};

module.exports = { clientInfo, logAudit };
