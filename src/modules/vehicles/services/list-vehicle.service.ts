import {
  VehicleFilters,
  VehiclesRepository,
} from '@modules/vehicles/repositories/vehicles.repository';

export class ListVehicleService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(filters?: VehicleFilters) {
    return await this.repository.findAll(filters);
  }
}
