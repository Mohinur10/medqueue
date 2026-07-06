import { prisma } from '../prisma/client';
import { Prisma } from '@prisma/client';

export class DepartmentRepository {
  static async create(data: Prisma.DepartmentCreateInput) {
    return prisma.department.create({ data });
  }

  static async findById(id: string) {
    return prisma.department.findUnique({ where: { id } });
  }

  static async update(id: string, data: Prisma.DepartmentUpdateInput) {
    return prisma.department.update({ where: { id }, data });
  }

  static async softDelete(id: string) {
    return prisma.department.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    });
  }

  static async restore(id: string) {
    return prisma.department.update({
      where: { id },
      data: { deletedAt: null, isActive: true }
    });
  }

  static async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.DepartmentWhereInput;
    orderBy?: Prisma.DepartmentOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return prisma.department.findMany({ skip, take, where, orderBy });
  }

  static async findByNameAndHospital(name: string, hospitalId: string) {
    return prisma.department.findFirst({
      where: { name: { equals: name, }, hospitalId, deletedAt: null }
    });
  }
}
