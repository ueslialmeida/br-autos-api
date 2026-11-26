import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetVehicleByManufacturingPeriodFromService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(manufacturingPeriodFrom: number) {
    const vehicles = await this.repository.findByManufacturingPeriodFrom(manufacturingPeriodFrom);
    if (!vehicles.length) {
      throw new NotFoundError('Veículos não encontrados para esse período de fabricação.');
    }
    return vehicles;
  }
}
