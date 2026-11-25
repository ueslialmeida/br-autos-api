import { NotFoundError } from '@shared/errors/AppError';

import type { UpdateEngineDTO } from '../dtos/update-engine.dto';
import type { EnginesRepository } from '../repositories/engines.repository';

export class UpdateEngineService {
  constructor(private readonly repository: EnginesRepository) {}

  async execute(id: string, engine: UpdateEngineDTO) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Motor não encontrado.');
    }
    return await this.repository.update(id, engine);
  }
}
