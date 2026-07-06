/* eslint-disable @typescript-eslint/no-explicit-any */
import { DoctorRepository } from '../repositories/doctor.repository';
import { HospitalRepository } from '../repositories/hospital.repository';
import { DepartmentRepository } from '../repositories/department.repository';
import { AuditRepository } from '../repositories/audit.repository';
import { UploadService } from './upload.service';
import { generateSlug } from '../utils/slug';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors';
import { Prisma } from '@prisma/client';
import { Role } from '../types/prisma-enums';;

export class DoctorService {
  private static async checkDirectorAccess(userId: string, userRole: Role, hospitalId: string) {
    if (userRole === Role.DIRECTOR) {
      const hospital = await HospitalRepository.findById(hospitalId);
      if (!hospital || hospital.directorId !== userId) {
        throw new ForbiddenError('You can only manage doctors in your own hospital');
      }
    }
  }

  static async create(userId: string, userRole: Role, data: any, certificatesFiles?: Express.Multer.File[]) {
    await this.checkDirectorAccess(userId, userRole, data.hospitalId);

    const department = await DepartmentRepository.findById(data.departmentId);
    if (!department || department.hospitalId !== data.hospitalId) {
      throw new ConflictError('Department does not exist or does not belong to this hospital');
    }

    // slug uses userId to be globally unique
    const slug = generateSlug(`${data.specialization}-${data.userId}`); 

    const doctor = await DoctorRepository.create({
      slug,
      specialization: data.specialization,
      experienceYears: data.experienceYears,
      education: data.education,
      languages: data.languages,
      biography: data.biography,
      consultationFee: data.consultationFee,
      licenseNumber: data.licenseNumber,
      isAvailable: data.isAvailable,
      isActive: data.isActive,
      maxPatients: data.maxPatients,
      user: { connect: { id: data.userId } },
      hospital: { connect: { id: data.hospitalId } },
      department: { connect: { id: data.departmentId } }
    });

    if (certificatesFiles && certificatesFiles.length > 0) {
      for (const file of certificatesFiles) {
        const url = await UploadService.uploadDocument(file.buffer, 'medqueue/certificates');
        await DoctorRepository.addCertificate(doctor.id, url, 'Uploaded Certificate', 'System');
      }
    }

    await AuditRepository.log(userId, 'DOCTOR_CREATED', 'Doctor', doctor.id);
    return doctor;
  }

  static async update(userId: string, userRole: Role, doctorId: string, data: any, certificatesFiles?: Express.Multer.File[]) {
    const existing = await DoctorRepository.findById(doctorId);
    if (!existing || existing.deletedAt) throw new NotFoundError('Doctor not found');

    if (userRole === Role.DOCTOR) {
      if (existing.userId !== userId) {
        throw new ForbiddenError('You can only update your own profile');
      }
    } else {
      await this.checkDirectorAccess(userId, userRole, existing.hospitalId);
    }

    const updateData: Prisma.DoctorUpdateInput = {
      specialization: data.specialization,
      experienceYears: data.experienceYears,
      education: data.education,
      languages: data.languages,
      biography: data.biography,
      consultationFee: data.consultationFee,
      licenseNumber: data.licenseNumber,
      isAvailable: data.isAvailable,
      isActive: data.isActive,
      maxPatients: data.maxPatients,
    };

    const doctor = await DoctorRepository.update(doctorId, updateData);

    if (certificatesFiles && certificatesFiles.length > 0) {
      for (const file of certificatesFiles) {
        const url = await UploadService.uploadDocument(file.buffer, 'medqueue/certificates');
        await DoctorRepository.addCertificate(doctor.id, url, 'Uploaded Certificate', 'System');
      }
    }

    await AuditRepository.log(userId, 'DOCTOR_UPDATED', 'Doctor', doctor.id);
    return doctor;
  }

  static async getById(id: string) {
    const doctor = await DoctorRepository.findById(id);
    if (!doctor || doctor.deletedAt) throw new NotFoundError('Doctor not found');
    return doctor;
  }

  static async getAll(query: any) {
    const { page = 1, limit = 10, search, hospitalId, departmentId, experienceYears, isActive, sort } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: Prisma.DoctorWhereInput = { deletedAt: null };
    
    if (search) {
      where.OR = [
        { specialization: { contains: String(search), } },
        { user: { firstName: { contains: String(search), } } },
        { user: { lastName: { contains: String(search), } } }
      ];
    }
    if (hospitalId) where.hospitalId = String(hospitalId);
    if (departmentId) where.departmentId = String(departmentId);
    if (experienceYears) where.experienceYears = { gte: Number(experienceYears) };
    if (isActive !== undefined) where.isActive = isActive === 'true';

    let orderBy: Prisma.DoctorOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };

    const doctors = await DoctorRepository.findAll({ skip, take, where, orderBy });
    return { data: doctors, page: Number(page), limit: take };
  }

  static async delete(userId: string, userRole: Role, doctorId: string) {
    const doctor = await DoctorRepository.findById(doctorId);
    if (!doctor || doctor.deletedAt) throw new NotFoundError('Doctor not found');

    await this.checkDirectorAccess(userId, userRole, doctor.hospitalId);

    await DoctorRepository.softDelete(doctorId);
    await AuditRepository.log(userId, 'DOCTOR_DELETED', 'Doctor', doctorId);
  }

  static async restore(userId: string, userRole: Role, doctorId: string) {
    const doctor = await DoctorRepository.findById(doctorId);
    if (!doctor) throw new NotFoundError('Doctor not found');
    if (!doctor.deletedAt) throw new ConflictError('Doctor is already active');

    await this.checkDirectorAccess(userId, userRole, doctor.hospitalId);

    await DoctorRepository.restore(doctorId);
    await AuditRepository.log(userId, 'DOCTOR_RESTORED', 'Doctor', doctorId);
  }
}
