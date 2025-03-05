ALTER TABLE "transaction_categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "transaction_categories" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_name_unique";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "budget" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "is_recurring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "total_spent" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "month_spent" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "previous_month_spent" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "transaction_type";