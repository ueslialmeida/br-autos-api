import type { CreateVehicleDTO } from '@modules/vehicles/dtos/index';
import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';

export class CreateVehicleService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(vehicle: CreateVehicleDTO) {
    // It is possible to add multiple vehicles with the same model and generation
    // as manufacturers can have vehicles with the same model and generation
    // but different manufacturing period, category, body type, etc.
    // So we will not check for duplicates here.
    return await this.repository.create(vehicle);
  }
}
