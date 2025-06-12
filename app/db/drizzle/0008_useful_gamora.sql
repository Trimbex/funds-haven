CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_name" text,
	"account_type" text,
	"balance" numeric(10, 2) DEFAULT '0.00',
	"cardno" text,
	"card_company" text DEFAULT 'Other',
	"isVerified" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verificationTokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationTokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "provider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "providerAccountId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "expires_at" integer;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "token_type" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "scope" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "id_token" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "session_state" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emailVerified" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_bank_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "account_name";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "account_type";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "balance";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "cardno";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "card_company";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "isVerified";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "created_at";