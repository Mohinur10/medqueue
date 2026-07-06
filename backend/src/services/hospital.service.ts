/* eslint-disable @typescript-eslint/no-explicit-any */
import { HospitalRepository } from '../repositories/hospital.repository';
import { AuditRepository } from '../repositories/audit.repository';
import { UploadService } from './upload.service';
import { generateSlug } from '../utils/slug';
import { NotFoundError, ConflictError } from '../utils/errors';
import { Prisma } from '@prisma/client';

export class HospitalService {
  static async create(userId: string, data: any, logoFile?: Express.Multer.File) {
    let logoUrl = undefined;
    if (logoFile) {
      logoUrl = await UploadService.uploadImage(logoFile.buffer, 'medqueue/hospitals');
    }

    const slug = generateSlug(data.name);

    const hospital = await HospitalRepository.create({
      name: data.name,
      slug,
      description: data.description,
      logo: logoUrl,
      address: data.address,
      region: data.region,
      district: data.district,
      phone: data.phone,
      email: data.email,
      website: data.website,
      workingHours: data.workingHours,
      emergencyAvailable: data.emergencyAvailable,
      isActive: data.isActive,
      latitude: data.latitude,
      longitude: data.longitude,
      director: data.directorId ? { connect: { id: data.directorId } } : undefined
    });

    await AuditRepository.log(userId, 'HOSPITAL_CREATED', 'Hospital', hospital.id);

    return hospital;
  }

  static async update(userId: string, hospitalId: string, data: any, logoFile?: Express.Multer.File) {
    const existing = await HospitalRepository.findById(hospitalId);
    if (!existing || existing.deletedAt) throw new NotFoundError('Hospital not found');

    let logoUrl = existing.logo;
    if (logoFile) {
      logoUrl = await UploadService.uploadImage(logoFile.buffer, 'medqueue/hospitals');
    }

    const updateData: Prisma.HospitalUpdateInput = {
      name: data.name,
      description: data.description,
      logo: logoUrl,
      address: data.address,
      region: data.region,
      district: data.district,
      phone: data.phone,
      email: data.email,
      website: data.website,
      workingHours: data.workingHours,
      emergencyAvailable: data.emergencyAvailable,
      isActive: data.isActive,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    if (data.directorId) {
      updateData.director = { connect: { id: data.directorId } };
    } else if (data.directorId === null) {
      updateData.director = { disconnect: true };
    }

    const hospital = await HospitalRepository.update(hospitalId, updateData);

    await AuditRepository.log(userId, 'HOSPITAL_UPDATED', 'Hospital', hospital.id);

    return hospital;
  }

  static async getById(id: string) {
    const hospital = await HospitalRepository.findById(id);
    if (!hospital || hospital.deletedAt) throw new NotFoundError('Hospital not found');
    return hospital;
  }

  static async getAll(query: any) {
    const { page = 1, limit = 10, search, region, district, isActive, sort } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: Prisma.HospitalWhereInput = { deletedAt: null };
    
    if (search) {
      where.name = { contains: String(search), };
    }
    if (region) where.region = String(region);
    if (district) where.district = String(district);
    if (isActive !== undefined) where.isActive = isActive === 'true';

    let orderBy: Prisma.HospitalOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'alphabetical') orderBy = { name: 'asc' };

    const hospitals = await HospitalRepository.findAll({ skip, take, where, orderBy });
    
    return { data: hospitals, page: Number(page), limit: take };
  }

  static async delete(userId: string, hospitalId: string) {
    const hospital = await HospitalRepository.findById(hospitalId);
    if (!hospital || hospital.deletedAt) throw new NotFoundError('Hospital not found');

    await HospitalRepository.softDelete(hospitalId);
    await AuditRepository.log(userId, 'HOSPITAL_DELETED', 'Hospital', hospitalId);
  }

  static async restore(userId: string, hospitalId: string) {
    const hospital = await HospitalRepository.findById(hospitalId);
    if (!hospital) throw new NotFoundError('Hospital not found');
    if (!hospital.deletedAt) throw new ConflictError('Hospital is already active');

    await HospitalRepository.restore(hospitalId);
    await AuditRepository.log(userId, 'HOSPITAL_RESTORED', 'Hospital', hospitalId);
  }
}
