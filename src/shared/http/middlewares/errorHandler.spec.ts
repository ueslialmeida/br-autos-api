import logger from '@config/logger';
import { AppError, ConflictError, NotFoundError } from '@shared/errors/AppError';
import { errorHandler } from '@shared/http/middlewares/errorHandler';
import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

jest.mock('@config/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('errorHandler', () => {
  const makeResponseMock = () => {
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    res.status.mockReturnValue(res);
    return res as unknown as Response;
  };

  const req = {} as Request;
  const next = jest.fn() as NextFunction;

  it('deve responder com status e mensagem de um AppError', () => {
    const res = makeResponseMock();
    const error = new AppError('Requisição inválida', 400);

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Requisição inválida',
    });
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('deve responder com status 404 para NotFoundError', () => {
    const res = makeResponseMock();
    const error = new NotFoundError('Fabricante não encontrado');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Fabricante não encontrado',
    });
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('deve responder com status 409 para ConflictError', () => {
    const res = makeResponseMock();
    const error = new ConflictError('Fabricante já cadastrado');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Fabricante já cadastrado',
    });
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('deve responder com status 400 e detalhes para ZodError', () => {
    const res = makeResponseMock();
    const schema = z.object({
      name: z.string().min(2),
    });

    const parsed = schema.safeParse({ name: 'A' });
    if (parsed.success) {
      throw new Error('Esperava falha de validação do Zod');
    }

    errorHandler(parsed.error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Dados de entrada inválidos',
      details: parsed.error.issues,
    });
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('deve responder com status 500 genérico para erro inesperado', () => {
    const res = makeResponseMock();
    const error = new Error('Falha inesperada de conexão');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
    });
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
