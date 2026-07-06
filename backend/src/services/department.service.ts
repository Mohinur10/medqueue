/* eslint-disable @typescript-eslint/no-explicit-any */
import { DepartmentRepository } from '../repositories/department.repository';
import { HospitalRepository } from '../repositories/hospital.repository';
import { AuditRepository } from '../repositories/audit.repository';
import { generateSlug } from '../utils/slug';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors';
import { Prisma } from '@prisma/client';
import { Role } from '../types/prisma-enums';;

export class DepartmentService {
  private static async checkDirectorAccess(userId: string, userRole: Role, hospitalId: string) {
    if (userRole === Role.DIRECTOR) {
      const hospital = await HospitalRepository.findById(hospitalId);
      if (!hospital || hospital.directorId !== userId) {
        throw new ForbiddenError('You can only manage departments in your own hospital');
      }
    }
  }

  static async create(userId: string, userRole: Role, data: any) {
    await this.checkDirectorAccess(userId, userRole, data.hospitalId);

    const hospital = await HospitalRepository.findById(data.hospitalId);
    if (!hospital || hospital.deletedAt) throw new NotFoundError('Hospital not found');

    const existing = await DepartmentRepository.findByNameAndHospital(data.name, data.hospitalId);
    if (existing) throw new ConflictError('Department with this name already exists in this hospital');

    const slug = generateSlug(`${hospital.name}-${data.name}`);

    const department = await DepartmentRepository.create({
      name: data.name,
      slug,
      description: data.description,
      icon: data.icon,
      floor: data.floor,
      roomNumber: data.roomNumber,
      phone: data.phone,
      isActive: data.isActive,
      hospital: { connect: { id: data.hospitalId } }
    });

    await AuditRepository.log(userId, 'DEPARTMENT_CREATED', 'Department', department.id);
    return department;
  }

  static async update(userId: string, userRole: Role, departmentId: string, data: any) {
    const existing = await DepartmentRepository.findById(departmentId);
    if (!existing || existing.deletedAt) throw new NotFoundError('Department not found');

    await this.checkDirectorAccess(userId, userRole, existing.hospitalId);

    if (data.name && data.name !== existing.name) {
      const nameCheck = await DepartmentRepository.findByNameAndHospital(data.name, existing.hospitalId);
      if (nameCheck) throw new ConflictError('Department name already exists in this hospital');
    }

    const updateData: Prisma.DepartmentUpdateInput = {
      name: data.name,
      description: data.description,
      icon: data.icon,
      floor: data.floor,
      roomNumber: data.roomNumber,
      phone: data.phone,
      isActive: data.isActive
    };

    const department = await DepartmentRepository.update(departmentId, updateData);
    await AuditRepository.log(userId, 'DEPARTMENT_UPDATED', 'Department', department.id);
    return department;
  }

  static async getById(id: string) {
    const department = await DepartmentRepository.findById(id);
    if (!department || department.deletedAt) throw new NotFoundError('Department not found');
    return department;
  }

  static async getAll(query: any) {
    const { page = 1, limit = 10, search, hospitalId, isActive, sort } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: Prisma.DepartmentWhereInput = { deletedAt: null };
    
    if (search) {
      where.name = { contains: String(search), };
    }
    if (hospitalId) where.hospitalId = String(hospitalId);
    if (isActive !== undefined) where.isActive = isActive === 'true';

    let orderBy: Prisma.DepartmentOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'alphabetical') orderBy = { name: 'asc' };

    const departments = await DepartmentRepository.findAll({ skip, take, where, orderBy });
    return { data: departments, page: Number(page), limit: take };
  }

  static async delete(userId: string, userRole: Role, departmentId: string) {
    const department = await DepartmentRepository.findById(departmentId);
    if (!department || department.deletedAt) throw new NotFoundError('Department not found');

    await this.checkDirectorAccess(userId, userRole, department.hospitalId);

    await DepartmentRepository.softDelete(departmentId);
    await AuditRepository.log(userId, 'DEPARTMENT_DELETED', 'Department', departmentId);
  }

  static async restore(userId: string, userRole: Role, departmentId: string) {
    const department = await DepartmentRepository.findById(departmentId);
    if (!department) throw new NotFoundError('Department not found');
    if (!department.deletedAt) throw new ConflictError('Department is already active');

    await this.checkDirectorAccess(userId, userRole, department.hospitalId);

    await DepartmentRepository.restore(departmentId);
    await AuditRepository.log(userId, 'DEPARTMENT_RESTORED', 'Department', departmentId);
  }
}
