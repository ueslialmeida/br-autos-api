import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetVehicleByManufacturerNameService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(manufacturerName: string) {
    const vehicles = await this.repository.findByManufacturerName(manufacturerName);
    if (!vehicles.length) {
      throw new NotFoundError('Veículos não encontrados para esse fabricante.');
    }
    return vehicles;
  }
}
