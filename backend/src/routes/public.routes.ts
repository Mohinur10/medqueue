import { Router } from 'express';
import { HospitalController } from '../controllers/hospital.controller';
import { DepartmentController } from '../controllers/department.controller';
import { DoctorController } from '../controllers/doctor.controller';
import { validate } from '../middlewares/validate';
import { getHospitalParamsSchema } from '../validators/hospital.validator';
import { getDepartmentParamsSchema } from '../validators/department.validator';
import { getDoctorParamsSchema } from '../validators/doctor.validator';

const router = Router();

/**
 * @swagger
 * /public/hospitals:
 *   get:
 *     summary: Get all hospitals (Public)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of hospitals
 */
router.get('/hospitals', HospitalController.getAll);

/**
 * @swagger
 * /public/hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID (Public)
 *     tags: [Public]
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
router.get('/hospitals/:id', validate(getHospitalParamsSchema), HospitalController.getById);

/**
 * @swagger
 * /public/departments:
 *   get:
 *     summary: Get all departments (Public)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get('/departments', DepartmentController.getAll);

/**
 * @swagger
 * /public/departments/{id}:
 *   get:
 *     summary: Get department by ID (Public)
 *     tags: [Public]
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
router.get('/departments/:id', validate(getDepartmentParamsSchema), DepartmentController.getById);

/**
 * @swagger
 * /public/doctors:
 *   get:
 *     summary: Get all doctors (Public)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/doctors', DoctorController.getAll);

/**
 * @swagger
 * /public/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID (Public)
 *     tags: [Public]
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
router.get('/doctors/:id', validate(getDoctorParamsSchema), DoctorController.getById);

export default router;
