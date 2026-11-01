import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const manufactures = pgTable('manufactures', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Manufacturer = typeof manufactures.$inferSelect;
export type NewManufacturer = typeof manufactures.$inferInsert;
