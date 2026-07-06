import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { uploadMultipleDocuments } from '../middlewares/upload.middleware';
import { createDoctorSchema, updateDoctorSchema, getDoctorParamsSchema } from '../validators/doctor.validator';
import { Role } from '../types/prisma-enums';;

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/', DoctorController.getAll);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor details
 */
router.get('/:id', validate(getDoctorParamsSchema), DoctorController.getById);

// SUPER_ADMIN, ADMIN, DIRECTOR, and DOCTOR (for self update)
router.use(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.DIRECTOR, Role.DOCTOR));

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a doctor
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               hospitalId:
 *                 type: string
 *               departmentId:
 *                 type: string
 *               specialization:
 *                 type: string
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', uploadMultipleDocuments, validate(createDoctorSchema), DoctorController.create);

/**
 * @swagger
 * /doctors/{id}:
 *   patch:
 *     summary: Update a doctor
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:id', uploadMultipleDocuments, validate(updateDoctorSchema), DoctorController.update);

// Delete routes restricted more tightly
router.use(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.DIRECTOR));

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Soft delete a doctor
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', validate(getDoctorParamsSchema), DoctorController.delete);

/**
 * @swagger
 * /doctors/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted doctor
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restored
 */
router.post('/:id/restore', validate(getDoctorParamsSchema), DoctorController.restore);

export default router;
