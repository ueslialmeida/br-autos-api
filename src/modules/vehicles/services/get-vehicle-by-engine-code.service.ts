import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetVehicleByEngineCodeService {
  constructor(private readonly repository: VehiclesRepository) {}

  async execute(engineCode: string) {
    const vehicles = await this.repository.findByEngineCode(engineCode);
    if (!vehicles.length) {
      throw new NotFoundError('Veículos não encontrados para esse código de motor.');
    }
    return vehicles;
  }
}
