import { CreateManufacturerDTO, UpdateManufacturerDTO } from '@modules/manufacturers/dtos/index';
import {
  CreateManufacturerService,
  DeleteManufacturerService,
  GetManufacturerByIdService,
  GetManufacturerByNameService,
  ListManufacturerService,
  UpdateManufacturerService,
} from '@modules/manufacturers/services/index';
import { Request, Response } from 'express';
import { z } from 'zod';

const idParamSchema = z.object({
  id: z.uuid().min(1, 'ID é obrigatório'),
});

const nameParamSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
});

export class ManufacturersController {
  constructor(
    private readonly createManufacturerService: CreateManufacturerService,
    private readonly listManufacturerService: ListManufacturerService,
    private readonly getManufacturerByIdService: GetManufacturerByIdService,
    private readonly getManufacturerByNameService: GetManufacturerByNameService,
    private readonly updateManufacturerService: UpdateManufacturerService,
    private readonly deleteManufacturerService: DeleteManufacturerService,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const data: CreateManufacturerDTO = req.body;
    const manufacturer = await this.createManufacturerService.execute(data);

    res.status(201).json({
      status: 'success',
      data: manufacturer,
    });
  }

  async list(_req: Request, res: Response): Promise<void> {
    const manufacturers = await this.listManufacturerService.execute();

    res.status(200).json({
      status: 'success',
      data: manufacturers,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    const manufacturer = await this.getManufacturerByIdService.execute(id);

    res.status(200).json({
      status: 'success',
      data: manufacturer,
    });
  }

  async getByName(req: Request, res: Response): Promise<void> {
    const { name } = nameParamSchema.parse(req.params);
    const manufacturer = await this.getManufacturerByNameService.execute(name);

    res.status(200).json({
      status: 'success',
      data: manufacturer,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    const data: UpdateManufacturerDTO = req.body;
    const manufacturer = await this.updateManufacturerService.execute(id, data);

    res.status(200).json({
      status: 'success',
      data: manufacturer,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    await this.deleteManufacturerService.execute(id);

    res.status(204).send();
  }
}
