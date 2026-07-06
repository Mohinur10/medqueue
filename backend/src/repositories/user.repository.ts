import { prisma } from '../prisma/client';
import { Prisma } from '@prisma/client';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  static async findByPhone(phoneOrEmail: string) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { phone: phoneOrEmail },
          { email: phoneOrEmail }
        ]
      }
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  static async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data
    });
  }

  static async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  static async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    });
  }

  static async incrementFailedAttempts(id: string, maxAttempts: number, lockMinutes: number) {
    const user = await this.findById(id);
    if (!user) return null;
    
    const newAttempts = user.failedLoginAttempts + 1;
    const lockUntil = newAttempts >= maxAttempts ? new Date(Date.now() + lockMinutes * 60000) : null;
    const accountLocked = newAttempts >= maxAttempts;
    
    return prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: newAttempts,
        lockUntil,
        accountLocked
      }
    });
  }

  static async resetFailedAttempts(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null,
        accountLocked: false
      }
    });
  }
}
