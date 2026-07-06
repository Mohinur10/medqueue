import { z } from 'zod';

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    icon: z.string().optional(),
    floor: z.string().optional(),
    roomNumber: z.string().optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional(),
    hospitalId: z.string().uuid('Invalid Hospital ID')
  })
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    floor: z.string().optional(),
    roomNumber: z.string().optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().uuid('Invalid Department ID')
  })
});

export const getDepartmentParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Department ID')
  })
});
