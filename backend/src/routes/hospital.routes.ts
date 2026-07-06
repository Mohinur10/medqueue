import { Router } from 'express';
import { HospitalController } from '../controllers/hospital.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { uploadSingleImage } from '../middlewares/upload.middleware';
import { createHospitalSchema, updateHospitalSchema, getHospitalParamsSchema } from '../validators/hospital.validator';
import { Role } from '../types/prisma-enums';;

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /hospitals:
 *   get:
 *     summary: Get all hospitals
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of hospitals
 */
router.get('/', HospitalController.getAll);

/**
 * @swagger
 * /hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID
 *     tags: [Hospital]
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
 *         description: Hospital details
 */
router.get('/:id', validate(getHospitalParamsSchema), HospitalController.getById);

// SUPER_ADMIN and ADMIN only for modifications
router.use(authorize(Role.SUPER_ADMIN, Role.ADMIN));

/**
 * @swagger
 * /hospitals:
 *   post:
 *     summary: Create a hospital
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', uploadSingleImage.single('logo'), validate(createHospitalSchema), HospitalController.create);

/**
 * @swagger
 * /hospitals/{id}:
 *   patch:
 *     summary: Update a hospital
 *     tags: [Hospital]
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
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:id', uploadSingleImage.single('logo'), validate(updateHospitalSchema), HospitalController.update);

/**
 * @swagger
 * /hospitals/{id}:
 *   delete:
 *     summary: Soft delete a hospital
 *     tags: [Hospital]
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
router.delete('/:id', validate(getHospitalParamsSchema), HospitalController.delete);

/**
 * @swagger
 * /hospitals/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted hospital
 *     tags: [Hospital]
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
router.post('/:id/restore', validate(getHospitalParamsSchema), HospitalController.restore);

export default router;
