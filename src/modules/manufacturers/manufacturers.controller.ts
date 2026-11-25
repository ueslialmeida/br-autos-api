import { Request, Response } from 'express';
import { z } from 'zod';

import { CreateManufacturerDTO } from '../dtos/create-manufacturer.dto';
import { UpdateManufacturerDTO } from '../dtos/update-manufacturer.dto';
import { CreateManufacturerService } from '../services/create-manufacturer.service';
import { DeleteManufacturerService } from '../services/delete-manufacturer.service';
import { GetManufacturerByIdService } from '../services/get-manufacturer-by-id.service';
import { ListManufacturerService } from '../services/list-manufacturer.service';
import { UpdateManufacturerService } from '../services/update-manufacturer.service';

const idParamSchema = z.object({
  id: z.uuid().min(1, 'ID é obrigatório'),
});

export class ManufacturersController {
  constructor(
    private readonly createManufacturerService: CreateManufacturerService,
    private readonly listManufacturerService: ListManufacturerService,
    private readonly getManufacturerByIdService: GetManufacturerByIdService,
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
