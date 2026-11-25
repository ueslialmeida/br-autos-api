import { NotFoundError } from '@shared/errors/AppError';

import type { ManufacturersRepository } from '../repositories/manufacturers.repository';

export class GetManufacturerByIdService {
  constructor(private readonly repository: ManufacturersRepository) {}

  async execute(id: string) {
    const manufacturer = await this.repository.findById(id);

    if (!manufacturer) {
      throw new NotFoundError('Fabricante não encontrado.');
    }

    return manufacturer;
  }
}
