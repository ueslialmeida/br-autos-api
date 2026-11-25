import { NotFoundError } from '@shared/errors/AppError';

import type { EnginesRepository } from '../repositories/engines.repository';

export class DeleteEngineService {
  constructor(private readonly repository: EnginesRepository) {}

  async execute(id: string) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Motor não encontrado.');
    }
  }
}
