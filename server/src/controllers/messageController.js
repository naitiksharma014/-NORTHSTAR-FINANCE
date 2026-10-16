import mongoose from 'mongoose';
import ContactMessage from '../models/ContactMessage.js';
import { escapeHtml, getContactInbox, isEmailConfigured, sendEmail } from '../utils/mailer.js';

export async function createMessage(req, res) {
  // Honeypot field: bots often fill every input. Silently accept without storing or emailing.
  if (String(req.body?.company_website || '').trim()) {
    return res.status(201).json({ message: 'Thank you. Your message has been received.' });
  }
  const { name, email, phone = '', subject = '', message } = req.body || {};
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPhone = String(phone || '').trim();
  const cleanSubject = String(subject || '').replace(/[\r\n]+/g, ' ').trim();
  const cleanMessage = String(message || '').trim();
  if (!cleanName || !cleanEmail || !cleanMessage) return res.status(400).json({ message: 'Please fill in your name, email and message.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ message: 'Please enter a valid email address.' });
  if (cleanName.length > 120 || cleanEmail.length > 254 || cleanPhone.length > 40 || cleanSubject.length > 200 || cleanMessage.length > 5000) {
    return res.status(400).json({ message: 'One or more fields exceed the allowed length.' });
  }

  const saved = await ContactMessage.create({ name: cleanName, email: cleanEmail, phone: cleanPhone, subject: cleanSubject, message: cleanMessage });
  let emailNotificationSent = false;
  let autoReplySent = false;
  const inbox = getContactInbox();
  const safeName = escapeHtml(cleanName);
  const safeEmail = escapeHtml(cleanEmail);
  const safePhone = escapeHtml(cleanPhone || 'Not provided');
  const safeSubject = escapeHtml(cleanSubject || 'General enquiry');
  const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, '<br>');

  if (isEmailConfigured() && inbox) {
    try {
      await sendEmail({
        to: inbox,
        replyTo: cleanEmail,
        subject: `New website enquiry: ${cleanSubject || 'General enquiry'}`,
        text: `A new contact form submission was received.\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone || 'Not provided'}\nSubject: ${cleanSubject || 'General enquiry'}\n\nMessage:\n${cleanMessage}\n\nMessage ID: ${saved._id}`,
        html: `<h2>New website enquiry</h2><p><b>Name:</b> ${safeName}</p><p><b>Email:</b> ${safeEmail}</p><p><b>Phone:</b> ${safePhone}</p><p><b>Subject:</b> ${safeSubject}</p><p><b>Message:</b><br>${safeMessage}</p><p style="color:#777;font-size:12px">Message ID: ${saved._id}</p>`,
      });
      emailNotificationSent = true;
    } catch (error) {
      console.error('Contact notification email failed:', error.message);
    }

    if (String(process.env.MAIL_SEND_AUTO_REPLY || 'true').toLowerCase() === 'true') {
      try {
        await sendEmail({
          to: cleanEmail,
          subject: 'We received your message',
          text: `Hi ${cleanName},\n\nThank you for contacting us. We have received your message and our team will review it.\n\nYour message: ${cleanMessage}\n\nRegards,\n${process.env.MAIL_SIGNATURE || 'The Website Team'}`,
          html: `<p>Hi ${safeName},</p><p>Thank you for contacting us. We have received your message and our team will review it.</p><p><b>Your message:</b><br>${safeMessage}</p><p>Regards,<br>${escapeHtml(process.env.MAIL_SIGNATURE || 'The Website Team')}</p>`,
        });
        autoReplySent = true;
      } catch (error) {
        console.error('Contact auto-reply email failed:', error.message);
      }
    }
  }

  res.status(201).json({
    message: 'Thank you. Your message has been received.',
    id: saved._id,
    emailNotificationSent,
    autoReplySent,
    emailConfigured: isEmailConfigured(),
  });
}

export async function listMessages(req, res) {
  res.json(await ContactMessage.find().sort({ createdAt: -1 }).lean());
}

export async function updateMessage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid message ID.' });
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!message) return res.status(404).json({ message: 'Message not found.' });
  res.json(message);
}

export async function replyToMessage(req, res) {
  const { reply } = req.body;
  const cleanReply = String(reply || '').trim();
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid message ID.' });
  if (!cleanReply) return res.status(400).json({ message: 'Please write a reply before sending.' });
  if (cleanReply.length > 10000) return res.status(400).json({ message: 'Reply must be 10,000 characters or fewer.' });
  const message = await ContactMessage.findById(req.params.id);
  if (!message) return res.status(404).json({ message: 'Message not found.' });
  const safeName = escapeHtml(message.name);
  const safeReply = escapeHtml(cleanReply).replace(/\n/g, '<br>');
  await sendEmail({
    to: message.email,
    replyTo: getContactInbox() || undefined,
    subject: `Re: ${message.subject || 'Your enquiry'}`,
    text: `Hi ${message.name},\n\n${cleanReply}\n\nRegards,\n${process.env.MAIL_SIGNATURE || 'The Website Team'}`,
    html: `<p>Hi ${safeName},</p><div>${safeReply}</div><p>Regards,<br>${escapeHtml(process.env.MAIL_SIGNATURE || 'The Website Team')}</p>`,
  });
  message.status = 'replied';
  await message.save();
  res.json({ message: 'Reply sent successfully.', contactMessage: message });
}

export async function testEmail(req, res) {
  if (!isEmailConfigured()) {
    return res.status(503).json({ message: 'Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in server/.env.' });
  }
  const destination = getContactInbox() || req.admin?.email;
  if (!destination) return res.status(400).json({ message: 'Set CONTACT_TO or SMTP_USER in server/.env.' });
  await sendEmail({
    to: destination,
    subject: 'Website email delivery test',
    text: `This is a test email from your website admin panel.

Sent at: ${new Date().toISOString()}`,
    html: `<p>This is a test email from your website admin panel.</p><p>Sent at: ${new Date().toISOString()}</p>`
  });
  res.json({ message: `Test email sent to ${destination}. Check that inbox and spam folder.` });
}

export async function deleteMessage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid message ID.' });
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ message: 'Message not found.' });
  res.json({ message: 'Message deleted.' });
}
