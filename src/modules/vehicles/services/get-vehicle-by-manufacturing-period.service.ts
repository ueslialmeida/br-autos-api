import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetVehicleByManufacturingPeriodService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(startYear: number, endYear: number) {
    const vehicles = await this.repository.findByManufacturingPeriod(startYear, endYear);
    if (!vehicles.length) {
      throw new NotFoundError('Veículos não encontrados para esse período de fabricação.');
    }
    return vehicles;
  }
}
