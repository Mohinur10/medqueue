import { Request, Response, NextFunction } from 'express';
import { HospitalService } from '../services/hospital.service';
import { sendSuccess } from '../utils/apiResponse';

export class HospitalController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const hospital = await HospitalService.create(req.user!.userId, req.body, req.file);
      sendSuccess(res, hospital, 'Hospital created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const hospital = await HospitalService.update(req.user!.userId, req.params.id as string, req.body, req.file);
      sendSuccess(res, hospital, 'Hospital updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const hospital = await HospitalService.getById(req.params.id as string);
      sendSuccess(res, hospital, 'Hospital retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await HospitalService.getAll(req.query);
      sendSuccess(res, result, 'Hospitals retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await HospitalService.delete(req.user!.userId, req.params.id as string);
      sendSuccess(res, null, 'Hospital deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async restore(req: Request, res: Response, next: NextFunction) {
    try {
      await HospitalService.restore(req.user!.userId, req.params.id as string);
      sendSuccess(res, null, 'Hospital restored successfully');
    } catch (error) {
      next(error);
    }
  }
}
