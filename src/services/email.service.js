'use strict';

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Create a transporter using SMTP or a service.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email alert.
 * @param {string} to - Recipient email.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text content.
 * @param {string} html - HTML content.
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Portfolio Admin Hub" <${process.env.SMTP_FROM || 'noreply@portfolio.com'}>`,
      to,
      subject,
      text,
      html,
    });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email send failure:', error);
    // Don't throw, just log. We don't want to break the app if email fails.
  }
};

/**
 * Specific alert for failed login.
 */
const sendSecurityAlert = async ({ email, failedCount, ip, browser, device, timestamp, capturedImage }) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  
  const subject = '⚠️ Security Alert: Failed Login Attempt';
  const html = `
    <div style="font-family: sans-serif; padding: 30px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #ffffff; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444; margin-top: 0;">Security Alert Detected</h2>
      <p style="color: #4b5563; font-size: 16px;">A failed login attempt was detected for your account: <strong>${email}</strong>.</p>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Attempts:</strong> ${failedCount} / 5</p>
        <p style="margin: 5px 0;"><strong>IP Address:</strong> ${ip || 'Unknown'}</p>
        <p style="margin: 5px 0;"><strong>Device:</strong> ${device || 'Unknown'}</p>
        <p style="margin: 5px 0;"><strong>Browser:</strong> ${browser || 'Unknown'}</p>
        <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${timestamp}</p>
      </div>



      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
        If this was not you, please immediately log in using your <strong>Emergency Passkey</strong> to lock down your account and update your password.
      </p>
    </div>
  `;
  
  await sendEmail(adminEmail, subject, `Failed login attempt for ${email} from IP: ${ip}`, html);
};

module.exports = {
  sendEmail,
  sendSecurityAlert,
};
