import { db } from '@config/database';
import { engines } from '@modules/engines/engines.schema';
import { manufacturers } from '@modules/manufacturers/manufacturers.schema';
import { NewVehicle, Vehicle, vehicles } from '@modules/vehicles/vehicles.schema';
import { and, asc, countDistinct, desc, eq, gte, ilike, isNull, lte, or, SQL } from 'drizzle-orm';

export type VehicleSortField = 'model' | 'generation' | 'manufacturingPeriodStart' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface VehiclePaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: VehicleSortField;
  order?: SortOrder;
}

export interface PaginatedVehiclesRepositoryResult {
  data: Vehicle[];
  totalItems: number;
  page: number;
  limit: number;
}

const sortColumnMap = {
  model: vehicles.model,
  generation: vehicles.generation,
  manufacturingPeriodStart: vehicles.manufacturingPeriodStart,
  createdAt: vehicles.createdAt,
} as const;

export interface VehicleFilters {
  startYear?: number;
  endYear?: number;
  model?: string;
  manufacturerId?: string;
  manufacturerName?: string;
  engineId?: string;
  engineCode?: string;
}

export class VehiclesRepository {
  async create(data: NewVehicle): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values(data).returning();
    return vehicle;
  }

  async findById(id: string): Promise<Vehicle | undefined> {
    const vehicle = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
    return vehicle[0];
  }

  async findByModel(model: string): Promise<Vehicle[]> {
    const vehiclesList = await db
      .select()
      .from(vehicles)
      .where(ilike(vehicles.model, `%${model}%`));
    return vehiclesList;
  }

  async findByManufacturerId(manufacturerId: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.manufacturerId, manufacturerId));
  }

  async findByManufacturerName(manufacturerName: string): Promise<Vehicle[]> {
    const result = await db
      .select({
        vehicle: vehicles,
      })
      .from(vehicles)
      .innerJoin(manufacturers, eq(vehicles.manufacturerId, manufacturers.id))
      .where(ilike(manufacturers.name, manufacturerName));

    return result.map((row) => row.vehicle);
  }

  async findByEngineId(engineId: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.engineId, engineId));
  }

  async findByEngineCode(engineCode: string): Promise<Vehicle[]> {
    const result = await db
      .select({
        vehicle: vehicles,
      })
      .from(vehicles)
      .innerJoin(engines, eq(vehicles.engineId, engines.id))
      .where(ilike(engines.code, engineCode));

    return result.map((row) => row.vehicle);
  }

  async findAll(
    filters: VehicleFilters = {},
    options: VehiclePaginationOptions = {},
  ): Promise<PaginatedVehiclesRepositoryResult> {
    const conditions: SQL[] = [];

    // Filtro de período de fabricação (suporta intervalo completo ou apenas um dos extremos)
    if (filters.startYear !== undefined && filters.endYear !== undefined) {
      conditions.push(
        lte(vehicles.manufacturingPeriodStart, filters.endYear),
        or(
          gte(vehicles.manufacturingPeriodEnd, filters.startYear),
          isNull(vehicles.manufacturingPeriodEnd),
        )!,
      );
    } else if (filters.startYear !== undefined) {
      conditions.push(
        or(
          gte(vehicles.manufacturingPeriodEnd, filters.startYear),
          isNull(vehicles.manufacturingPeriodEnd),
        )!,
      );
    } else if (filters.endYear !== undefined) {
      conditions.push(lte(vehicles.manufacturingPeriodStart, filters.endYear));
    }

    // Filtros diretos na tabela vehicles
    if (filters.model) {
      conditions.push(ilike(vehicles.model, `%${filters.model}%`));
    }

    if (filters.manufacturerId) {
      conditions.push(eq(vehicles.manufacturerId, filters.manufacturerId));
    }

    if (filters.engineId) {
      conditions.push(eq(vehicles.engineId, filters.engineId));
    }

    // Filtros em tabelas relacionadas (Manufacturers e Engines)
    if (filters.manufacturerName) {
      conditions.push(ilike(manufacturers.name, `%${filters.manufacturerName}%`));
    }

    if (filters.engineCode) {
      conditions.push(ilike(engines.code, `%${filters.engineCode}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Paginação e ordenação
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const offset = (page - 1) * limit;
    const orderDirection = options.order === 'desc' ? desc : asc;
    const primarySortColumn = sortColumnMap[options.sortBy ?? 'createdAt'];

    // Executa busca dos itens da página e contagem total filtrada em paralelo
    const [rows, [{ total }]] = await Promise.all([
      db
        .select({ vehicle: vehicles })
        .from(vehicles)
        .leftJoin(manufacturers, eq(vehicles.manufacturerId, manufacturers.id))
        .leftJoin(engines, eq(vehicles.engineId, engines.id))
        .where(whereClause)
        .orderBy(orderDirection(primarySortColumn), asc(vehicles.id))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: countDistinct(vehicles.id) })
        .from(vehicles)
        .leftJoin(manufacturers, eq(vehicles.manufacturerId, manufacturers.id))
        .leftJoin(engines, eq(vehicles.engineId, engines.id))
        .where(whereClause),
    ]);

    return {
      data: rows.map((row) => row.vehicle),
      totalItems: Number(total),
      page,
      limit,
    };
  }

  async update(id: string, data: Partial<NewVehicle>): Promise<Vehicle | undefined> {
    const [vehicle] = await db.update(vehicles).set(data).where(eq(vehicles.id, id)).returning();
    return vehicle;
  }

  async delete(id: string): Promise<boolean> {
    const [vehicle] = await db.delete(vehicles).where(eq(vehicles.id, id)).returning();
    return !!vehicle;
  }
}
