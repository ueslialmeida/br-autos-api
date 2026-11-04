import logger from '@config/logger';
import { AppError } from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(error: Error, _req: Request, res: Response): void {
  // Business logic errors
  if (error instanceof AppError) {
    logger.error(`AppError: ${error.message}`);
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    logger.error(`ZodError: ${error.message}`);
    res.status(400).json({
      status: 'fail',
      message: 'Dados de entrada inválidos',
      details: error.issues,
    });
    return;
  }

  // Unexpected errors
  logger.error(`Unexpected error: ${error.message}`);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
