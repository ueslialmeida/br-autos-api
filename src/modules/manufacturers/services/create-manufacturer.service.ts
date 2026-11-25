import { ConflictError } from '@shared/errors/AppError';

import type { CreateManufacturerDTO } from '../dtos/create-manufacturer.dto';
import type { ManufacturersRepository } from '../repositories/manufacturers.repository';

export class CreateManufacturerService {
  constructor(private readonly repository: ManufacturersRepository) {}

  async execute(manufacturer: CreateManufacturerDTO) {
    // Domain rule: avoid duplicated manufacturer names
    const existing = await this.repository.findByName?.(manufacturer.name);

    if (existing) {
      throw new ConflictError('Fabricante já cadastrado com este nome.');
    }

    return await this.repository.create(manufacturer);
  }
}
