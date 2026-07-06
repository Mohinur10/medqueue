import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { verifyAccessToken } from '../utils/jwt';
import { Role } from '../types/prisma-enums';;
import { prisma } from '../prisma/client';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.mq_token) {
      token = req.cookies.mq_token;
    }

    if (!token) {
      return next(new UnauthorizedError('Authentication token is missing or invalid'));
    }
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user || user.deletedAt) {
      return next(new UnauthorizedError('User account not found or deleted'));
    }
    
    if (!user.isActive) {
      return next(new UnauthorizedError('User account is disabled'));
    }

    if (user.accountLocked && user.lockUntil && user.lockUntil > new Date()) {
      return next(new UnauthorizedError('Account is temporarily locked due to multiple failed login attempts'));
    }

    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
};
