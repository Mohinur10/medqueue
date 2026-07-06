import { z } from 'zod';

export const createHospitalSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    address: z.string().optional(),
    region: z.string().optional(),
    district: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    workingHours: z.string().optional(),
    emergencyAvailable: z.string().optional().transform(val => val === 'true').or(z.boolean().optional()),
    isActive: z.string().optional().transform(val => val === 'true').or(z.boolean().optional()),
    directorId: z.string().uuid('Invalid Director ID').optional(),
    latitude: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
    longitude: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
  })
});

export const updateHospitalSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    region: z.string().optional(),
    district: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    workingHours: z.string().optional(),
    emergencyAvailable: z.string().optional().transform(val => val === 'true').or(z.boolean().optional()),
    isActive: z.string().optional().transform(val => val === 'true').or(z.boolean().optional()),
    directorId: z.string().uuid('Invalid Director ID').optional().nullable(),
    latitude: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
    longitude: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
  }),
  params: z.object({
    id: z.string().uuid('Invalid Hospital ID')
  })
});

export const getHospitalParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Hospital ID')
  })
});
