import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetVehicleByEngineIdService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(engineId: string) {
    const vehicles = await this.repository.findByEngineId(engineId);
    if (!vehicles.length) {
      throw new NotFoundError('Veículos não encontrados para esse motor.');
    }
    return vehicles;
  }
}
