import { db } from '@config/database';
import { Engine, engines, NewEngine } from '@modules/engines/engines.schema';
import { manufacturers } from '@modules/manufacturers/manufacturers.schema';
import { eq, ilike } from 'drizzle-orm';

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

  async findAll(): Promise<Engine[]> {
    return await db.select().from(engines);
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
