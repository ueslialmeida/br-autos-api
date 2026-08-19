import { integer, pgTable, real, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const engines = pgTable('engines', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 255 }).notNull().unique(),
  displacement: real('displacement').notNull(),
  power: integer('power').notNull(),
  torque: real('torque').notNull(),
  fuelType: varchar('fuel_type', { length: 50 }).notNull(),
  valves: integer('valves').notNull(),
  cylinders: integer('cylinders').notNull(),
  synchronism: varchar('synchronism', { length: 50 }).notNull(),
  aspiration: varchar('aspiration', { length: 50 }).notNull(),
  layout: varchar('layout', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Engine = typeof engines.$inferSelect;
export type NewEngine = typeof engines.$inferInsert;
