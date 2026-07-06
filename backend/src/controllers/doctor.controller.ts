import { Request, Response, NextFunction } from 'express';
import { DoctorService } from '../services/doctor.service';
import { sendSuccess } from '../utils/apiResponse';

export class DoctorController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const doctor = await DoctorService.create(req.user!.userId, req.user!.role, req.body, files);
      sendSuccess(res, doctor, 'Doctor created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const doctor = await DoctorService.update(req.user!.userId, req.user!.role, req.params.id as string, req.body, files);
      sendSuccess(res, doctor, 'Doctor updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await DoctorService.getById(req.params.id as string);
      sendSuccess(res, doctor, 'Doctor retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DoctorService.getAll(req.query);
      sendSuccess(res, result, 'Doctors retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await DoctorService.delete(req.user!.userId, req.user!.role, req.params.id as string);
      sendSuccess(res, null, 'Doctor deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async restore(req: Request, res: Response, next: NextFunction) {
    try {
      await DoctorService.restore(req.user!.userId, req.user!.role, req.params.id as string);
      sendSuccess(res, null, 'Doctor restored successfully');
    } catch (error) {
      next(error);
    }
  }
}
