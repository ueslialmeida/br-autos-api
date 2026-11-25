import { EnginesRepository } from '../repositories/engines.repository';

export class ListEngineService {
  constructor(private readonly repository: EnginesRepository) {}

  async execute() {
    return await this.repository.findAll();
  }
}
