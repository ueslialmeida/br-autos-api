import { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';

export class ListVehicleService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute() {
    return await this.repository.findAll();
  }
}
