import { NotFoundError } from '@shared/errors/AppError';

import type { EnginesRepository } from '../repositories/engines.repository';

export class GetEngineByIdService {
  constructor(private readonly repository: EnginesRepository) {}

  async execute(id: string) {
    const engine = await this.repository.findById(id);
    if (!engine) {
      throw new NotFoundError('Motor não encontrado.');
    }
    return engine;
  }
}
