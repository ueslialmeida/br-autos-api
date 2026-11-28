import { Engine } from '@modules/engines/engines.schema';
import {
  EngineFilters,
  EnginePaginationOptions,
  EnginesRepository,
} from '@modules/engines/repositories/engines.repository';
import { buildPaginationMeta, PaginatedResult } from '@shared/pagination';

export class ListEngineService {
  constructor(private readonly repository: EnginesRepository) {}

  async execute(
    filters: EngineFilters = {},
    pagination: EnginePaginationOptions = {},
  ): Promise<PaginatedResult<Engine>> {
    const result = await this.repository.findAll(filters, pagination);

    return {
      data: result.data,
      pagination: buildPaginationMeta(result.page, result.limit, result.totalItems),
    };
  }
}
