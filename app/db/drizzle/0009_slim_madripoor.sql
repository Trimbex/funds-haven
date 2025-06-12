CREATE TABLE "nextauth_accounts" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "nextauth_accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
ALTER TABLE "bank_accounts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "bank_accounts" CASCADE;--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_id_bank_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "account_name" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "account_type" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "balance" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "cardno" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "card_company" text DEFAULT 'Other';--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "isVerified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "nextauth_accounts" ADD CONSTRAINT "nextauth_accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "provider";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "providerAccountId";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "refresh_token";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "access_token";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "expires_at";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "token_type";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "scope";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "id_token";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "session_state";