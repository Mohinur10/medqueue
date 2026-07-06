import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface IMailService {
  sendVerificationEmail(to: string, token: string): Promise<void>;
  sendPasswordResetEmail(to: string, token: string): Promise<void>;
}

class EtherealMailService implements IMailService {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter() {
    if (!this.transporter) {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info(`Ethereal Email initialized: ${testAccount.user}`);
    }
    return this.transporter;
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const transporter = await this.getTransporter();
    const verificationUrl = `http://localhost:3000/auth/verify?token=${token}`;
    
    const info = await transporter.sendMail({
      from: '"MedQueue" <noreply@medqueue.com>',
      to,
      subject: 'Verify your MedQueue account',
      text: `Please verify your email by clicking on this link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking on this link: <a href="${verificationUrl}">Verify Email</a></p>`
    });
    
    logger.info(`Verification email sent to ${to}. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const transporter = await this.getTransporter();
    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    
    const info = await transporter.sendMail({
      from: '"MedQueue" <noreply@medqueue.com>',
      to,
      subject: 'Reset your MedQueue password',
      text: `You requested a password reset. Click on this link: ${resetUrl}`,
      html: `<p>You requested a password reset. Click on this link: <a href="${resetUrl}">Reset Password</a></p>`
    });

    logger.info(`Password reset email sent to ${to}. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
}

export const mailService: IMailService = new EtherealMailService();
