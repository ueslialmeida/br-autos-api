import { Request, Response } from 'express';
import { z } from 'zod';

import { CreateEngineDTO, UpdateEngineDTO } from './dtos/index';
import {
  CreateEngineService,
  DeleteEngineService,
  GetEngineByCodeService,
  GetEngineByIdService,
  GetEngineByManufacturerIdService,
  GetEngineByManufacturerNameService,
  ListEngineService,
  UpdateEngineService,
} from './services/index';

const idParamSchema = z.object({
  id: z.uuid().min(1, 'ID é obrigatório'),
});

const codeParamSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
});

const manufacturerIdParamSchema = z.object({
  manufacturerId: z.uuid().min(1, 'ID do fabricante é obrigatório'),
});

const manufacturerNameParamSchema = z.object({
  manufacturerName: z.string().min(1, 'Nome do fabricante é obrigatório'),
});

export class EnginesController {
  constructor(
    private readonly createEngineService: CreateEngineService,
    private readonly listEngineService: ListEngineService,
    private readonly getEngineByIdService: GetEngineByIdService,
    private readonly getEngineByCodeService: GetEngineByCodeService,
    private readonly getEngineByManufacturerIdService: GetEngineByManufacturerIdService,
    private readonly getEngineByManufacturerNameService: GetEngineByManufacturerNameService,
    private readonly updateEngineService: UpdateEngineService,
    private readonly deleteEngineService: DeleteEngineService,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const data: CreateEngineDTO = req.body;
    const engine = await this.createEngineService.execute(data);

    res.status(201).json({
      status: 'success',
      data: engine,
    });
  }

  async list(_req: Request, res: Response): Promise<void> {
    const engines = await this.listEngineService.execute();

    res.status(200).json({
      status: 'success',
      data: engines,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    const engine = await this.getEngineByIdService.execute(id);

    res.status(200).json({
      status: 'success',
      data: engine,
    });
  }

  async getByCode(req: Request, res: Response): Promise<void> {
    const { code } = codeParamSchema.parse(req.params);
    const engine = await this.getEngineByCodeService.execute(code);

    res.status(200).json({
      status: 'success',
      data: engine,
    });
  }

  async getByManufacturerId(req: Request, res: Response): Promise<void> {
    const { manufacturerId } = manufacturerIdParamSchema.parse(req.params);
    const engines = await this.getEngineByManufacturerIdService.execute(manufacturerId);

    res.status(200).json({
      status: 'success',
      data: engines,
    });
  }

  async getByManufacturerName(req: Request, res: Response): Promise<void> {
    const { manufacturerName } = manufacturerNameParamSchema.parse(req.params);
    const engines = await this.getEngineByManufacturerNameService.execute(manufacturerName);

    res.status(200).json({
      status: 'success',
      data: engines,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    const data: UpdateEngineDTO = req.body;
    const engine = await this.updateEngineService.execute(id, data);

    res.status(200).json({
      status: 'success',
      data: engine,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    await this.deleteEngineService.execute(id);

    res.status(204).send();
  }
}
