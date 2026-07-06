import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as Record<string, unknown>;
      req.body = parsed.body;
      req.query = parsed.query as unknown as Request['query'];
      req.params = parsed.params as unknown as Request['params'];
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = (error as unknown as { errors: z.ZodIssue[] }).errors;
        const errors = issues.map((e: z.ZodIssue) => ({
          field: e.path.join('.'),
          message: e.message
        }));
        next(new ValidationError('Invalid request data', errors));
      } else {
        next(error);
      }
    }
  };
};
