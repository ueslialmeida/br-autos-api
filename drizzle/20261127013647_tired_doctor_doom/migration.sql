ALTER TABLE "vehicles" RENAME COLUMN "manufacturing_period" TO "manufacturing_period_start";--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "manufacturing_period_end" smallint;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "generation" SET DATA TYPE smallint USING "generation"::smallint;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "generation" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "body_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "manufacturing_period_start" SET DATA TYPE smallint USING "manufacturing_period_start"::smallint;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "manufacturing_period_start" DROP NOT NULL;