import { NotFoundError } from '@shared/errors/AppError';

import type { EnginesRepository } from '../repositories/engines.repository';

export class GetEngineByCodeService {
  constructor(private readonly repository: EnginesRepository) {}

  async execute(code: string) {
    const engine = await this.repository.findByCode(code);
    if (!engine) {
      throw new NotFoundError('Motor não encontrado.');
    }
    return engine;
  }
}
