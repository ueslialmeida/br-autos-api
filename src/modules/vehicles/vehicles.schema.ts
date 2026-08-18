import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { engines } from '../engines/engines.schema';
import { manufactures } from '../manufactures/manufactures.schema';

export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  model: varchar('model', { length: 255 }).notNull(),
  generation: varchar('generation', { length: 255 }).notNull(),
  manufacturerId: uuid('manufacturer_id')
    .notNull()
    .references(() => manufactures.id),
  engineId: uuid('engine_id')
    .notNull()
    .references(() => engines.id),
  category: varchar('category', { length: 255 }).notNull(),
  bodyType: varchar('body_type', { length: 255 }).notNull(),
  manufacturingPeriod: varchar('manufacturing_period', { length: 255 }).notNull(),
  image: varchar('image', { length: 255 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
