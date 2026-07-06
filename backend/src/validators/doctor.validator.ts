import { z } from 'zod';

export const createDoctorSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid User ID'),
    hospitalId: z.string().uuid('Invalid Hospital ID'),
    departmentId: z.string().uuid('Invalid Department ID'),
    specialization: z.string().min(2),
    experienceYears: z.string().optional().transform(val => (val ? parseInt(val) : undefined)).or(z.number().optional()),
    education: z.string().optional(),
    languages: z.string().optional().transform(val => val ? val.split(',') : []), // Multipart sends arrays as strings or repeated fields, here we parse comma separated
    biography: z.string().optional(),
    consultationFee: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)).or(z.number().optional()),
    licenseNumber: z.string().optional(),
    isAvailable: z.string().optional().transform(val => val === 'true').or(z.boolean().optional()),
    isActive: z.string().optional().transform(val => val === 'true').or(z.boolean().optional()),
    maxPatients: z.string().optional().transform(val => (val ? parseInt(val) : undefined)).or(z.number().optional()),
  })
});

export const updateDoctorSchema = z.object({
  body: z.object({
    specialization: z.string().min(2).optional(),
    experienceYears: z.string().optional().transform(val => (val ? parseInt(val) : undefined)).or(z.number().optional()),
    education: z.string().optional(),
    languages: z.string().optional().transform(val => val ? val.split(',') : []),
    biography: z.string().optional(),
    consultationFee: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)).or(z.number().optional()),
    licenseNumber: z.string().optional(),
    isAvailable: z.string().optional().transform(val => val === 'true').or(z.boolean().optional()),
    isActive: z.string().optional().transform(val => val === 'true').or(z.boolean().optional()),
    maxPatients: z.string().optional().transform(val => (val ? parseInt(val) : undefined)).or(z.number().optional()),
  }),
  params: z.object({
    id: z.string().uuid('Invalid Doctor ID')
  })
});

export const getDoctorParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Doctor ID')
  })
});
