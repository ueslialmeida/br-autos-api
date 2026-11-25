import type { EnginesRepository } from '@modules/engines/repositories/engines.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetEngineByManufacturerIdService {
  constructor(private readonly repository: EnginesRepository) {}

  async execute(manufacturerId: string) {
    const engines = await this.repository.findByManufacturerId(manufacturerId);
    if (!engines) {
      throw new NotFoundError('Não encontrado motores para o fabricante especificado.');
    }
    return engines;
  }
}
