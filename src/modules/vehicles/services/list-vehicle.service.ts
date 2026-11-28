import {
  VehicleFilters,
  VehiclePaginationOptions,
  VehiclesRepository,
} from '@modules/vehicles/repositories/vehicles.repository';
import { Vehicle } from '@modules/vehicles/vehicles.schema';
import { buildPaginationMeta, PaginatedResult } from '@shared/pagination';

export class ListVehicleService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(
    filters: VehicleFilters = {},
    pagination: VehiclePaginationOptions = {},
  ): Promise<PaginatedResult<Vehicle>> {
    const result = await this.repository.findAll(filters, pagination);

    return {
      data: result.data,
      pagination: buildPaginationMeta(result.page, result.limit, result.totalItems),
    };
  }
}
