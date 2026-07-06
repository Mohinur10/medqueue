import { prisma } from '../prisma/client';
import { Prisma } from '@prisma/client';

export class AuditRepository {
  static async log(userId: string | null, action: string, entity: string, entityId: string, details?: unknown) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details: details ? JSON.stringify(details) : null
      }
    });
  }
}
