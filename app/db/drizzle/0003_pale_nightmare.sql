ALTER TABLE "transactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "transactions" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "category_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "category_description" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "tags" json;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "spent" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "color" text DEFAULT 'gray';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "predefined" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "is_recurring";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "total_spent";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "month_spent";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "previous_month_spent";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "deleted_at";