import { prisma } from '../prisma/client';
import { Prisma } from '@prisma/client';

export class HospitalRepository {
  static async create(data: Prisma.HospitalCreateInput) {
    return prisma.hospital.create({ data });
  }

  static async findById(id: string) {
    return prisma.hospital.findUnique({ where: { id } });
  }

  static async update(id: string, data: Prisma.HospitalUpdateInput) {
    return prisma.hospital.update({ where: { id }, data });
  }

  static async softDelete(id: string) {
    return prisma.hospital.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    });
  }

  static async restore(id: string) {
    return prisma.hospital.update({
      where: { id },
      data: { deletedAt: null, isActive: true }
    });
  }

  static async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.HospitalWhereInput;
    orderBy?: Prisma.HospitalOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return prisma.hospital.findMany({ skip, take, where, orderBy });
  }
}
