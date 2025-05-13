ALTER TABLE "categories" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "recurrence_settings" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "recurrence_settings" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "recurrence_settings" DROP COLUMN "deleted_at";