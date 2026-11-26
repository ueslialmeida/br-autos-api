import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class DeleteVehicleService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(id: string) {
    const vehicle = await this.repository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Veículo não encontrado.');
    }
  }
}
