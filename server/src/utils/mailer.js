import nodemailer from 'nodemailer';

const requiredSmtpSettings = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
export function isEmailConfigured() {
  return requiredSmtpSettings.every((key) => String(process.env[key] || '').trim());
}

let cachedTransporter;
function getTransporter() {
  if (!isEmailConfigured()) {
    const missing = requiredSmtpSettings.filter((key) => !String(process.env[key] || '').trim());
    const error = new Error(`Email is not configured. Missing: ${missing.join(', ')}.`);
    error.code = 'SMTP_NOT_CONFIGURED';
    error.status = 503;
    throw error;
  }
  if (!cachedTransporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: String(process.env.SMTP_SECURE || (port === 465)).toLowerCase() === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return cachedTransporter;
}

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export async function sendEmail({ to, subject, text, html, replyTo }) {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  return transporter.sendMail({ from, to, subject, text, html, replyTo });
}

export function getContactInbox() {
  return process.env.CONTACT_TO || process.env.SMTP_USER || '';
}
