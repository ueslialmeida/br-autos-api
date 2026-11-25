import logger from '@config/logger';
import { AppError } from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Business logic errors
  if (error instanceof AppError) {
    logger.warn(`${error.name}: ${error.message}`);
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    logger.warn(`ZodError: ${error.message}`);
    res.status(400).json({
      status: 'fail',
      message: 'Dados de entrada inválidos',
      details: error.issues,
    });
    return;
  }

  // Unexpected errors
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`Unexpected error: ${message}`);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
