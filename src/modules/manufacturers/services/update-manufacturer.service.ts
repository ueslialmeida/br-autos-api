import { NotFoundError } from '@shared/errors/AppError';

import type { UpdateManufacturerDTO } from '../dtos/update-manufacturer.dto';
import type { ManufacturersRepository } from '../repositories/manufacturers.repository';

export class UpdateManufacturerService {
  constructor(private readonly repository: ManufacturersRepository) {}

  async execute(id: string, manufacturer: UpdateManufacturerDTO) {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundError('Fabricante não encontrado.');
    }

    return await this.repository.update(id, manufacturer);
  }
}
