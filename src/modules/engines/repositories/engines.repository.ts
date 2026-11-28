import { db } from '@config/database';
import { Engine, engines, NewEngine } from '@modules/engines/engines.schema';
import { manufacturers } from '@modules/manufacturers/manufacturers.schema';
import { and, asc, countDistinct, desc, eq, ilike, SQL } from 'drizzle-orm';

export interface EngineFilters {
  code?: string;
  fuelType?: string;
  aspiration?: string;
  manufacturerId?: string;
  manufacturerName?: string;
}

export type EngineSortField = 'code' | 'displacement' | 'power' | 'torque' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface EnginePaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: EngineSortField;
  order?: SortOrder;
}

export interface PaginatedEnginesRepositoryResult {
  data: Engine[];
  totalItems: number;
  page: number;
  limit: number;
}

const sortColumnMap = {
  code: engines.code,
  displacement: engines.displacement,
  power: engines.power,
  torque: engines.torque,
  createdAt: engines.createdAt,
} as const;

export class EnginesRepository {
  async create(data: NewEngine): Promise<Engine> {
    const [engine] = await db.insert(engines).values(data).returning();
    return engine;
  }

  async findById(id: string): Promise<Engine | undefined> {
    const engine = await db.select().from(engines).where(eq(engines.id, id)).limit(1);
    return engine[0];
  }

  async findByCode(code: string): Promise<Engine | undefined> {
    const engine = await db.select().from(engines).where(eq(engines.code, code)).limit(1);
    return engine[0];
  }

  async findByManufacturerId(manufacturerId: string): Promise<Engine[]> {
    return await db.select().from(engines).where(eq(engines.manufacturerId, manufacturerId));
  }

  async findByManufacturerName(manufacturerName: string): Promise<Engine[]> {
    const result = await db
      .select({
        engine: engines,
      })
      .from(engines)
      .innerJoin(manufacturers, eq(engines.manufacturerId, manufacturers.id))
      .where(ilike(manufacturers.name, manufacturerName));

    return result.map((row) => row.engine);
  }

  async findAll(
    filters: EngineFilters = {},
    options: EnginePaginationOptions = {},
  ): Promise<PaginatedEnginesRepositoryResult> {
    const conditions: SQL[] = [];

    if (filters.code) {
      conditions.push(ilike(engines.code, `%${filters.code}%`));
    }

    if (filters.fuelType) {
      conditions.push(ilike(engines.fuelType, `%${filters.fuelType}%`));
    }

    if (filters.aspiration) {
      conditions.push(ilike(engines.aspiration, `%${filters.aspiration}%`));
    }

    if (filters.manufacturerId) {
      conditions.push(eq(engines.manufacturerId, filters.manufacturerId));
    }

    if (filters.manufacturerName) {
      conditions.push(ilike(manufacturers.name, `%${filters.manufacturerName}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const offset = (page - 1) * limit;
    const orderDirection = options.order === 'desc' ? desc : asc;
    const primarySortColumn = sortColumnMap[options.sortBy ?? 'createdAt'];

    const [rows, [{ total }]] = await Promise.all([
      db
        .select({ engine: engines })
        .from(engines)
        .leftJoin(manufacturers, eq(engines.manufacturerId, manufacturers.id))
        .where(whereClause)
        .orderBy(orderDirection(primarySortColumn), asc(engines.id))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: countDistinct(engines.id) })
        .from(engines)
        .leftJoin(manufacturers, eq(engines.manufacturerId, manufacturers.id))
        .where(whereClause),
    ]);

    return {
      data: rows.map((row) => row.engine),
      totalItems: Number(total),
      page,
      limit,
    };
  }

  async update(id: string, data: Partial<NewEngine>): Promise<Engine | undefined> {
    const [engine] = await db.update(engines).set(data).where(eq(engines.id, id)).returning();
    return engine;
  }

  async delete(id: string): Promise<boolean> {
    const [engine] = await db.delete(engines).where(eq(engines.id, id)).returning();
    return !!engine;
  }
}
