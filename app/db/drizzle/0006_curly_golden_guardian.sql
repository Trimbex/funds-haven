CREATE TABLE "recurrence_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"frequency" text,
	"interval" integer DEFAULT 1,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "recurrence_id" uuid;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "parent_transaction_id" uuid;--> statement-breakpoint
ALTER TABLE "recurrence_settings" ADD CONSTRAINT "recurrence_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurrence_id_recurrence_settings_id_fk" FOREIGN KEY ("recurrence_id") REFERENCES "public"."recurrence_settings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_parent_transaction_id_transactions_id_fk" FOREIGN KEY ("parent_transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "recurring";