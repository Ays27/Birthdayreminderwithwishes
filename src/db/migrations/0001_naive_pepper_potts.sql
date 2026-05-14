ALTER TABLE "birthdays" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "birthdays" ALTER COLUMN "date" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "birthdays" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "birthdays" ADD COLUMN "wish" text;--> statement-breakpoint
ALTER TABLE "birthdays" ADD COLUMN "created_at" timestamp DEFAULT now();