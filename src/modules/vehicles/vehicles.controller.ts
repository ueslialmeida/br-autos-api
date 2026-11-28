import { CreateVehicleDTO, UpdateVehicleDTO } from '@modules/vehicles/dtos/index';
import {
  CreateVehicleService,
  DeleteVehicleService,
  GetVehicleByEngineIdService,
  GetVehicleByIdService,
  GetVehicleByManufacturerIdService,
  ListVehicleService,
  UpdateVehicleService,
} from '@modules/vehicles/services/index';
import { paginationQuerySchema } from '@shared/pagination';
import { Request, Response } from 'express';
import { z } from 'zod';

const idParamSchema = z.object({
  id: z.uuid().min(1, 'ID é obrigatório'),
});

// Schema completo para validar os query params possíveis na listagem
const yearQuerySchema = z.coerce.number().int().min(1886).max(2100);

const listVehiclesQuerySchema = paginationQuerySchema.extend({
  manufacturingPeriod: z
    .string()
    .regex(/^\d{4}(-\d{4})?$/, 'Use o formato AAAA ou AAAA-AAAA')
    .transform((val) => {
      const [start, end] = val.split('-').map(Number);
      return {
        startYear: start,
        endYear: end ?? start,
      };
    })
    .optional(),
  startYear: yearQuerySchema.optional(),
  endYear: yearQuerySchema.optional(),
  model: z.string().min(1).optional(),
  manufacturerId: z.uuid().optional(),
  manufacturerName: z.string().min(1).optional(),
  engineId: z.uuid().optional(),
  engineCode: z.string().min(1).optional(),
  sortBy: z.enum(['model', 'generation', 'manufacturingPeriodStart', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export class VehiclesController {
  constructor(
    private readonly createVehicleService: CreateVehicleService,
    private readonly listVehicleService: ListVehicleService,
    private readonly getVehicleByIdService: GetVehicleByIdService,
    private readonly getVehicleByManufacturerIdService: GetVehicleByManufacturerIdService,
    private readonly getVehicleByEngineIdService: GetVehicleByEngineIdService,
    private readonly updateVehicleService: UpdateVehicleService,
    private readonly deleteVehicleService: DeleteVehicleService,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const data: CreateVehicleDTO = req.body;
    const vehicle = await this.createVehicleService.execute(data);

    res.status(201).json({
      status: 'success',
      data: vehicle,
    });
  }

  async list(req: Request, res: Response): Promise<void> {
    const query = listVehiclesQuerySchema.parse(req.query);

    const result = await this.listVehicleService.execute(
      {
        startYear: query.startYear ?? query.manufacturingPeriod?.startYear,
        endYear: query.endYear ?? query.manufacturingPeriod?.endYear,
        model: query.model,
        manufacturerId: query.manufacturerId,
        manufacturerName: query.manufacturerName,
        engineId: query.engineId,
        engineCode: query.engineCode,
      },
      {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        order: query.order,
      },
    );

    res.status(200).json({
      status: 'success',
      data: result.data,
      pagination: result.pagination,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    const vehicle = await this.getVehicleByIdService.execute(id);

    res.status(200).json({
      status: 'success',
      data: vehicle,
    });
  }

  async getByManufacturerId(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    const vehicles = await this.getVehicleByManufacturerIdService.execute(id);

    res.status(200).json({
      status: 'success',
      data: vehicles,
    });
  }

  async getByEngineId(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    const vehicles = await this.getVehicleByEngineIdService.execute(id);

    res.status(200).json({
      status: 'success',
      data: vehicles,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    const data: UpdateVehicleDTO = req.body;
    const vehicle = await this.updateVehicleService.execute(id, data);

    res.status(200).json({
      status: 'success',
      data: vehicle,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = idParamSchema.parse(req.params);
    await this.deleteVehicleService.execute(id);

    res.status(204).send();
  }
}
