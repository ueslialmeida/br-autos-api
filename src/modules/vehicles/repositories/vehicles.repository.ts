import { db } from '@config/database';
import { engines } from '@modules/engines/engines.schema';
import { manufacturers } from '@modules/manufacturers/manufacturers.schema';
import { NewVehicle, Vehicle, vehicles } from '@modules/vehicles/vehicles.schema';
import { and, eq, gte, ilike, isNull, lte, or, SQL } from 'drizzle-orm';

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

  async findAll(filters: VehicleFilters = {}): Promise<Vehicle[]> {
    const conditions: SQL[] = [];

    // Filtro de período de fabricação
    if (filters.startYear !== undefined && filters.endYear !== undefined) {
      conditions.push(
        // O carro começou a ser fabricado antes ou durante o fim do período buscado
        lte(vehicles.manufacturingPeriodStart, filters.endYear),
        // E terminou de ser fabricado depois ou durante o início do período buscado
        or(
          gte(vehicles.manufacturingPeriodEnd, filters.startYear),
          isNull(vehicles.manufacturingPeriodEnd), // Garante suporte a carros ainda em linha
        )!,
      );
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

    // Monta a query base selecionando apenas os campos do veículo
    const query = db
      .select({ vehicle: vehicles })
      .from(vehicles)
      .leftJoin(manufacturers, eq(vehicles.manufacturerId, manufacturers.id))
      .leftJoin(engines, eq(vehicles.engineId, engines.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const result = await query;
    return result.map((row) => row.vehicle);
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
