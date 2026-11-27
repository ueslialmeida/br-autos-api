import { pgTable, smallint, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { engines } from '../engines/engines.schema';
import { manufacturers } from '../manufacturers/manufacturers.schema';

export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  model: varchar('model', { length: 255 }).notNull(),
  generation: smallint('generation'),
  manufacturerId: uuid('manufacturer_id')
    .notNull()
    .references(() => manufacturers.id),
  engineId: uuid('engine_id')
    .notNull()
    .references(() => engines.id),
  category: varchar('category', { length: 255 }),
  bodyType: varchar('body_type', { length: 255 }),
  manufacturingPeriodStart: smallint('manufacturing_period_start'),
  manufacturingPeriodEnd: smallint('manufacturing_period_end'),
  image: varchar('image', { length: 255 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
