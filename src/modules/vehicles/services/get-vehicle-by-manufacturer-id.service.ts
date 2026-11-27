import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetVehicleByManufacturerIdService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(manufacturerId: string) {
    const vehicles = await this.repository.findByManufacturerId(manufacturerId);
    if (!vehicles.length) {
      throw new NotFoundError('Veículos não encontrados para esse fabricante.');
    }
    return vehicles;
  }
}
