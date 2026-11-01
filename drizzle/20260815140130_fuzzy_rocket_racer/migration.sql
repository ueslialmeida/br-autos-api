CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manufactures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "engines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" varchar(255) NOT NULL UNIQUE,
	"displacement" real NOT NULL,
	"power" integer NOT NULL,
	"torque" real NOT NULL,
	"fuel_type" varchar(50) NOT NULL,
	"valves" integer NOT NULL,
	"cylinders" integer NOT NULL,
	"synchronism" varchar(50) NOT NULL,
	"aspiration" varchar(50) NOT NULL,
	"layout" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"model" varchar(255) NOT NULL,
	"generation" varchar(255) NOT NULL,
	"manufacturer_id" uuid NOT NULL,
	"engine_id" uuid NOT NULL,
	"category" varchar(255) NOT NULL,
	"body_type" varchar(255) NOT NULL,
	"manufacturing_period" varchar(255) NOT NULL,
	"image" varchar(255),
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_manufacturer_id_manufactures_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufactures"("id");--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_engine_id_engines_id_fkey" FOREIGN KEY ("engine_id") REFERENCES "engines"("id");