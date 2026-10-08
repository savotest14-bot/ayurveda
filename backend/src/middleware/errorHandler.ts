import { Request, Response, NextFunction } from 'express';
import { ApiError, sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`Error processing ${req.method} ${req.url}: ${err.message}`, err);

  // Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return sendError(res, 'Validation failed', 400, formattedErrors);
  }

  // Prisma unique constraint errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      return sendError(res, `A record with this ${target} already exists`, 409);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'Requested record not found in database', 404);
    }
  }

  // Custom ApiError
  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  // Unhandled errors
  const isDev = process.env.NODE_ENV === 'development';
  return sendError(
    res,
    isDev ? err.message || 'Internal Server Error' : 'Internal Server Error',
    500,
    isDev ? [err.stack] : []
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
