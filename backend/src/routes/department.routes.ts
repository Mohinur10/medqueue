import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createDepartmentSchema, updateDepartmentSchema, getDepartmentParamsSchema } from '../validators/department.validator';
import { Role } from '../types/prisma-enums';;

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get('/', DepartmentController.getAll);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Department]
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
 *         description: Department details
 */
router.get('/:id', validate(getDepartmentParamsSchema), DepartmentController.getById);

// SUPER_ADMIN, ADMIN, and DIRECTOR can modify
router.use(authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.DIRECTOR));

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               hospitalId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', validate(createDepartmentSchema), DepartmentController.create);

/**
 * @swagger
 * /departments/{id}:
 *   patch:
 *     summary: Update a department
 *     tags: [Department]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:id', validate(updateDepartmentSchema), DepartmentController.update);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Soft delete a department
 *     tags: [Department]
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
router.delete('/:id', validate(getDepartmentParamsSchema), DepartmentController.delete);

/**
 * @swagger
 * /departments/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted department
 *     tags: [Department]
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
router.post('/:id/restore', validate(getDepartmentParamsSchema), DepartmentController.restore);

export default router;
