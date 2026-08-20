import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const manufacturers = pgTable('manufacturers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Manufacturer = typeof manufacturers.$inferSelect;
export type NewManufacturer = typeof manufacturers.$inferInsert;
