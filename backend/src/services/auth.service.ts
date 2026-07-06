import { UserRepository } from '../repositories/user.repository';
import { TokenRepository } from '../repositories/token.repository';
import { AuditRepository } from '../repositories/audit.repository';
import { mailService } from './email.service';
import { hashPassword, comparePassword, generateToken, hashToken } from '../utils/hash';
import { generateAccessToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { TokenType, Role } from '../types/prisma-enums';
import { RegisterInput, LoginInput, ResetPasswordInput, ChangePasswordInput, UpdateProfileInput, VerifyOtpInput } from '../types/auth.types';
import { OtpService } from './otp.service';
import { prisma } from '../prisma/client';

export class AuthService {
  static async initAuth(data: { phone: string, password?: string }, type: 'LOGIN' | 'REGISTER') {
    const user = await UserRepository.findByPhone(data.phone);
    
    if (!user || (!user.telegramId && !user.email?.endsWith('@medqueue.uz'))) {
      throw new UnauthorizedError('Telegram hisobingiz ulanmagan. Iltimos, @medqueue_bot orqali ro\'yxatdan o\'ting.');
    }

    if (user.accountLocked && user.lockUntil && user.lockUntil > new Date()) {
      throw new UnauthorizedError('Hisobingiz vaqtincha bloklangan.');
    }

    if (type === 'LOGIN' && data.password && user.password !== 'NO_PASSWORD') {
      const isValidPassword = await comparePassword(data.password, user.password);
      if (!isValidPassword) {
        await UserRepository.incrementFailedAttempts(user.id, 5, 15); 
        throw new UnauthorizedError('Telefon raqam yoki parol noto\'g\'ri');
      }
    }

    // TEST MODE BYPASS for our seeded accounts
    const isTestMode = user.email && user.email.endsWith('@medqueue.uz');
    const otp = isTestMode ? '123456' : OtpService.generateOtpCode();
    
    const tokenHash = hashToken(otp); 
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); 

    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: 'TELEGRAM_OTP' }
    });

    await TokenRepository.createVerificationToken(user.id, tokenHash, 'TELEGRAM_OTP' as TokenType, expiresAt);
    
    if (isTestMode) {
      return { message: 'TEST MODE: Telegram OTP is 123456.', phone: data.phone };
    }

    const sent = await OtpService.sendTelegramOtp(user.telegramId!, otp);
    if (!sent) {
      throw new Error('Telegram orqali kod yuborishda xatolik. Iltimos botni tekshiring.');
    }

    return { message: 'Tasdiqlash kodi Telegram botingizga yuborildi.', phone: user.phone };
  }

  static async verifyOtp(data: VerifyOtpInput, deviceInfo?: string, ipAddress?: string, userAgent?: string) {
    const user = await UserRepository.findByPhone(data.phone);
    if (!user) throw new UnauthorizedError('Foydalanuvchi topilmadi');

    const otpHash = hashToken(data.otp);
    
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        userId: user.id,
        type: 'TELEGRAM_OTP',
        tokenHash: otpHash,
        expiresAt: { gt: new Date() }
      }
    });

    if (!tokenRecord) {
      throw new UnauthorizedError('Kod noto\'g\'ri yoki muddati o\'tgan');
    }

    await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
    
    await UserRepository.resetFailedAttempts(user.id);
    
    const payload = { userId: user.id, role: user.role as Role };
    const accessToken = generateAccessToken(payload);
    const rawRefreshToken = generateToken();
    const refreshHash = hashToken(rawRefreshToken);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await TokenRepository.createRefreshToken(user.id, refreshHash, refreshExpiresAt, deviceInfo, undefined, ipAddress, userAgent);
    await AuditRepository.log(user.id, 'LOGIN_SUCCESS_OTP', 'User', user.id, { ipAddress });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        telegramId: user.telegramId
      },
      tokens: { accessToken, refreshToken: rawRefreshToken }
    };
  }

  static async refresh(rawRefreshToken: string, ipAddress?: string) {
    const refreshHash = hashToken(rawRefreshToken);
    const tokenRecord = await TokenRepository.findRefreshToken(refreshHash);

    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (tokenRecord.isRevoked) {
      await TokenRepository.revokeAllUserRefreshTokens(tokenRecord.userId);
      await AuditRepository.log(tokenRecord.userId, 'TOKEN_REUSE_DETECTED', 'RefreshToken', tokenRecord.id, { ipAddress });
      throw new UnauthorizedError('Security breach detected. All sessions have been revoked. Please log in again.');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = tokenRecord.user;
    if (!user || user.deletedAt || !user.isActive || (user.accountLocked && user.lockUntil && user.lockUntil > new Date())) {
      throw new UnauthorizedError('Account is disabled, locked, or deleted');
    }

    await TokenRepository.revokeRefreshToken(tokenRecord.id);

    const payload = { userId: user.id, role: user.role as Role };
    const accessToken = generateAccessToken(payload);
    const newRawRefreshToken = generateToken();
    const newRefreshHash = hashToken(newRawRefreshToken);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await TokenRepository.createRefreshToken(user.id, newRefreshHash, refreshExpiresAt, tokenRecord.deviceName || undefined, undefined, ipAddress, tokenRecord.userAgent || undefined);
    
    await AuditRepository.log(user.id, 'TOKEN_REFRESH', 'RefreshToken', tokenRecord.id, { ipAddress });

    return { accessToken, refreshToken: newRawRefreshToken };
  }

  static async logout(rawRefreshToken: string, userId: string) {
    const refreshHash = hashToken(rawRefreshToken);
    const tokenRecord = await TokenRepository.findRefreshToken(refreshHash);

    if (tokenRecord && tokenRecord.userId === userId && !tokenRecord.isRevoked) {
      await TokenRepository.revokeRefreshToken(tokenRecord.id);
      await AuditRepository.log(userId, 'LOGOUT', 'RefreshToken', tokenRecord.id);
    }
  }

  static async verifyEmail(rawToken: string) {
    const tokenHash = hashToken(rawToken);
    const tokenRecord = await TokenRepository.findVerificationToken(tokenHash, TokenType.EMAIL_VERIFICATION);

    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid verification token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedError('Verification token has expired');
    }

    await UserRepository.update(tokenRecord.userId, { isEmailVerified: true });
    await TokenRepository.deleteUserVerificationTokens(tokenRecord.userId, TokenType.EMAIL_VERIFICATION);
    await AuditRepository.log(tokenRecord.userId, 'EMAIL_VERIFIED', 'User', tokenRecord.userId);
  }

  static async resendVerification(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user || user.deletedAt || user.isEmailVerified) return; 

    await TokenRepository.deleteUserVerificationTokens(user.id, TokenType.EMAIL_VERIFICATION);

    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await TokenRepository.createVerificationToken(user.id, tokenHash, TokenType.EMAIL_VERIFICATION, expiresAt);
    await mailService.sendVerificationEmail(user.email, rawToken);
  }

  static async forgotPassword(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user || user.deletedAt || !user.isActive) return; 

    await TokenRepository.deleteUserVerificationTokens(user.id, TokenType.PASSWORD_RESET);

    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    await TokenRepository.createVerificationToken(user.id, tokenHash, TokenType.PASSWORD_RESET, expiresAt);
    await mailService.sendPasswordResetEmail(user.email, rawToken);
    await AuditRepository.log(user.id, 'PASSWORD_RESET_REQUEST', 'User', user.id);
  }

  static async resetPassword(data: ResetPasswordInput) {
    const tokenHash = hashToken(data.token!);
    const tokenRecord = await TokenRepository.findVerificationToken(tokenHash, TokenType.PASSWORD_RESET);

    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid reset token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedError('Reset token has expired');
    }

    const hashedPassword = await hashPassword(data.newPassword!);
    await UserRepository.update(tokenRecord.userId, { password: hashedPassword });
    await TokenRepository.deleteUserVerificationTokens(tokenRecord.userId, TokenType.PASSWORD_RESET);
    await TokenRepository.revokeAllUserRefreshTokens(tokenRecord.userId); 
    
    await AuditRepository.log(tokenRecord.userId, 'PASSWORD_RESET_SUCCESS', 'User', tokenRecord.userId);
  }

  static async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const isValid = await comparePassword(data.oldPassword!, user.password);
    if (!isValid) throw new UnauthorizedError('Incorrect old password');

    const hashedPassword = await hashPassword(data.newPassword!);
    await UserRepository.update(userId, { password: hashedPassword });
    await TokenRepository.revokeAllUserRefreshTokens(userId);
    
    await AuditRepository.log(userId, 'PASSWORD_CHANGED', 'User', userId);
  }

  static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const updateData = {
      phone: data.phone,
      address: data.address,
      avatar: data.avatar,
    };
    
    const user = await UserRepository.update(userId, updateData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async deleteAccount(userId: string) {
    await UserRepository.softDelete(userId);
    await TokenRepository.revokeAllUserRefreshTokens(userId);
    await AuditRepository.log(userId, 'ACCOUNT_DELETED', 'User', userId);
  }
}
