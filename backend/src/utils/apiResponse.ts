import { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, message: string, errors: unknown[] = [], statusCode: number = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
