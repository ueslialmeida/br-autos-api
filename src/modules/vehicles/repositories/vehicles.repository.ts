import { db } from '@config/database';
import { engines } from '@modules/engines/engines.schema';
import { manufacturers } from '@modules/manufacturers/manufacturers.schema';
import { NewVehicle, Vehicle, vehicles } from '@modules/vehicles/vehicles.schema';
import { and, eq, gte, ilike, lte } from 'drizzle-orm';

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

  async findByManufacturingPeriodFrom(startDate: number): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicles)
      .where(gte(vehicles.manufacturingPeriodStart, startDate));
  }

  async findByManufacturingPeriod(startDate: number, endDate: number): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicles)
      .where(
        and(
          gte(vehicles.manufacturingPeriodStart, startDate),
          lte(vehicles.manufacturingPeriodEnd, endDate),
        ),
      );
  }

  async findAll(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
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
