import { prisma } from '../prisma/client';
import { TokenType } from '../types/prisma-enums';;

export class TokenRepository {
  static async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date, deviceName?: string, deviceId?: string, ipAddress?: string, userAgent?: string) {
    return prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        deviceName,
        deviceId,
        ipAddress,
        userAgent
      }
    });
  }

  static async findRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });
  }

  static async updateRefreshTokenUsage(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { lastUsedAt: new Date() }
    });
  }

  static async revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { isRevoked: true, revokedAt: new Date() }
    });
  }

  static async revokeAllUserRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true, revokedAt: new Date() }
    });
  }

  static async createVerificationToken(userId: string, tokenHash: string, type: TokenType, expiresAt: Date) {
    return prisma.verificationToken.create({
      data: {
        userId,
        tokenHash,
        type,
        expiresAt
      }
    });
  }

  static async findVerificationToken(tokenHash: string, type: TokenType) {
    return prisma.verificationToken.findFirst({
      where: { tokenHash, type }
    });
  }

  static async deleteVerificationToken(id: string) {
    return prisma.verificationToken.delete({
      where: { id }
    });
  }
  
  static async deleteUserVerificationTokens(userId: string, type: TokenType) {
    return prisma.verificationToken.deleteMany({
      where: { userId, type }
    });
  }
}
