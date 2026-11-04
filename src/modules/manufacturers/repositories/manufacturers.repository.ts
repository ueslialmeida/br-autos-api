import { db } from '@config/database';
import {
  Manufacturer,
  manufacturers,
  NewManufacturer,
} from '@modules/manufacturers/manufacturers.schema';
import { eq } from 'drizzle-orm';

export class ManufacturersRepository {
  async create(data: NewManufacturer): Promise<Manufacturer> {
    const [manufacturer] = await db.insert(manufacturers).values(data).returning();
    return manufacturer;
  }

  async findById(id: string): Promise<Manufacturer | undefined> {
    const manufacturer = await db
      .select()
      .from(manufacturers)
      .where(eq(manufacturers.id, id))
      .limit(1);
    return manufacturer[0];
  }

  async findByName(name: string): Promise<Manufacturer | undefined> {
    const manufacturer = await db
      .select()
      .from(manufacturers)
      .where(eq(manufacturers.name, name))
      .limit(1);
    return manufacturer[0];
  }

  async findAll(): Promise<Manufacturer[]> {
    return await db.select().from(manufacturers);
  }

  async update(id: string, data: Partial<NewManufacturer>): Promise<Manufacturer | undefined> {
    const [updatedManufacturer] = await db
      .update(manufacturers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(manufacturers.id, id))
      .returning();
    return updatedManufacturer;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await db.delete(manufacturers).where(eq(manufacturers.id, id)).returning();
    return !!deleted;
  }
}
