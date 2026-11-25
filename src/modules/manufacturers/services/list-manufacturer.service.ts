import type { ManufacturersRepository } from '../repositories/manufacturers.repository';

export class ListManufacturerService {
  constructor(private readonly repository: ManufacturersRepository) {}

  async execute() {
    return await this.repository.findAll();
  }
}
