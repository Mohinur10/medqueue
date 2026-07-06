import { prisma } from '../prisma/client';
import { Prisma } from '@prisma/client';

export class DoctorRepository {
  static async create(data: Prisma.DoctorCreateInput) {
    return prisma.doctor.create({ data });
  }

  static async findById(id: string) {
    return prisma.doctor.findUnique({ 
      where: { id },
      include: { certificates: true, user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } }, department: true }
    });
  }

  static async update(id: string, data: Prisma.DoctorUpdateInput) {
    return prisma.doctor.update({ where: { id }, data });
  }

  static async softDelete(id: string) {
    return prisma.doctor.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    });
  }

  static async restore(id: string) {
    return prisma.doctor.update({
      where: { id },
      data: { deletedAt: null, isActive: true }
    });
  }

  static async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.DoctorWhereInput;
    orderBy?: Prisma.DoctorOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return prisma.doctor.findMany({ 
      skip, take, where, orderBy,
      include: { user: { select: { firstName: true, lastName: true, avatar: true } }, department: { select: { name: true } } }
    });
  }

  static async addCertificate(doctorId: string, fileUrl: string, title: string, issuer: string, issuedAt?: Date, expiresAt?: Date) {
    return prisma.doctorCertificate.create({
      data: { doctorId, fileUrl, title, issuer, issuedAt, expiresAt }
    });
  }

  static async deleteCertificate(certificateId: string) {
    return prisma.doctorCertificate.delete({ where: { id: certificateId } });
  }
}
