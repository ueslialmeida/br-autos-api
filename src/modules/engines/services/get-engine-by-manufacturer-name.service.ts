import type { EnginesRepository } from '@modules/engines/repositories/engines.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetEngineByManufacturerNameService {
  constructor(private readonly repository: EnginesRepository) {}

  async execute(manufacturerName: string) {
    const engines = await this.repository.findByManufacturerName(manufacturerName);
    if (!engines) {
      throw new NotFoundError('Não encontrado motores para o fabricante especificado.');
    }
    return engines;
  }
}
