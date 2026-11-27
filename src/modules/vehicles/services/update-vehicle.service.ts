import { UpdateVehicleDTO } from '@modules/vehicles/dtos/index';
import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class UpdateVehicleService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(id: string, data: UpdateVehicleDTO) {
    const vehicle = await this.repository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Veículo não encontrado.');
    }
    return await this.repository.update(id, data);
  }
}
