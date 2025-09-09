import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

class EmailService {
  constructor() {
    this.enabled = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (!this.enabled) {
      logger.warn('Email service disabled - SMTP environment variables not fully configured');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true' ? true : false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail({ to, subject, html, text }) {
    if (!this.enabled) {
      logger.info('[Email disabled] Skipping email send', { to, subject });
      return { accepted: [to], messageId: 'disabled' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `${process.env.FROM_NAME || 'PM Internship'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });

      logger.info('Email sent', { to, subject, messageId: info.messageId });
      return info;
    } catch (error) {
      logger.error('Failed to send email', { to, subject, error: error.message });
      throw error;
    }
  }

  async sendVerificationEmail(email, token) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;

    const subject = 'Verify your email address';
    const text = `Please verify your email by clicking this link: ${verifyUrl}\n\nIf the button doesn't work, copy this verification code and paste it on the verification page:\n${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your email address</h2>
        <p>Thanks for signing up for PM Internship. Please confirm your email address by clicking the button below:</p>
        <p>
          <a href="${verifyUrl}" style="display:inline-block;padding:10px 16px;background:#2563EB;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a>
        </p>
        <p>Or copy and paste this link into your browser:<br />
        <a href="${verifyUrl}">${verifyUrl}</a></p>
        <hr />
        <p>If the link doesn't work, use this verification code on the website:</p>
        <pre style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;overflow:auto">${token}</pre>
        <p style="color:#6b7280;font-size:12px;margin-top:8px;">Tip: Copy the entire code above and paste it on the verification page.</p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `;

    return this.sendMail({ to: email, subject, text, html });
  }

  async sendPasswordResetEmail(email, token) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    const subject = 'Reset your password';
    const text = `Reset your password by clicking this link: ${resetUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#16A34A;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a>
        </p>
        <p>Or copy and paste this link into your browser:<br />
        <a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `;

    return this.sendMail({ to: email, subject, text, html });
  }
}

const emailService = new EmailService();
export default emailService;
export { emailService };
