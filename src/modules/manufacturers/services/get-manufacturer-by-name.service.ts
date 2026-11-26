import type { ManufacturersRepository } from '@modules/manufacturers/repositories/manufacturers.repository';
import { NotFoundError } from '@shared/errors/AppError';

export class GetManufacturerByNameService {
  constructor(private readonly repository: ManufacturersRepository) {}

  async execute(name: string) {
    const manufacturer = await this.repository.findByName(name);

    if (!manufacturer) {
      throw new NotFoundError('Fabricante não encontrado.');
    }

    return manufacturer;
  }
}
