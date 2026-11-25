import type { CreateEngineDTO } from '../dtos/create-engine.dto';
import type { EnginesRepository } from '../repositories/engines.repository';

export class CreateEngineService {
  constructor(private readonly repository: EnginesRepository) {}

  async execute(engine: CreateEngineDTO) {
    // It is possible to add multiple engines with the same code
    // as manufacturers can have engines with the same code
    // but different displacement, power, etc.
    // So we will not check for duplicates here.
    return await this.repository.create(engine);
  }
}
