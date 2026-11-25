import { NotFoundError } from '@shared/errors/AppError';

import type { ManufacturersRepository } from '../repositories/manufacturers.repository';

export class DeleteManufacturerService {
  constructor(private readonly repository: ManufacturersRepository) {}

  async execute(id: string) {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Fabricante não encontrado.');
    }
  }
}
