import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { ApiError } from '../utils/apiResponse.js';
import { prisma } from '../config/db.js';
import { Role } from '@prisma/client';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: Role;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication token missing or invalid'));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUserPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return next(new ApiError(401, 'User account not found or deactivated'));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired session token'));
  }
};

export const optionalAuthenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUserPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true, isActive: true }
    });

    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };
    }

    next();
  } catch {
    next();
  }
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Access denied: insufficient permissions'));
    }

    next();
  };
};

export const requireAdmin = requireRole([Role.ADMIN]);
