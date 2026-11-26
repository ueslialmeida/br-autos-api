import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetVehicleByModelService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(model: string) {
    const vehicle = await this.repository.findByModel(model);
    if (!vehicle) {
      throw new NotFoundError('Veículo não encontrado.');
    }
    return vehicle;
  }
}
