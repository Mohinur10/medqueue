import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from '../services/department.service';
import { sendSuccess } from '../utils/apiResponse';

export class DepartmentController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const department = await DepartmentService.create(req.user!.userId, req.user!.role, req.body);
      sendSuccess(res, department, 'Department created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const department = await DepartmentService.update(req.user!.userId, req.user!.role, req.params.id as string, req.body);
      sendSuccess(res, department, 'Department updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const department = await DepartmentService.getById(req.params.id as string);
      sendSuccess(res, department, 'Department retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DepartmentService.getAll(req.query);
      sendSuccess(res, result, 'Departments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await DepartmentService.delete(req.user!.userId, req.user!.role, req.params.id as string);
      sendSuccess(res, null, 'Department deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async restore(req: Request, res: Response, next: NextFunction) {
    try {
      await DepartmentService.restore(req.user!.userId, req.user!.role, req.params.id as string);
      sendSuccess(res, null, 'Department restored successfully');
    } catch (error) {
      next(error);
    }
  }
}
