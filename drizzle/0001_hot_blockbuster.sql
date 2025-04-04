DROP INDEX "unique_category";--> statement-breakpoint
DROP INDEX "month_history_pk";--> statement-breakpoint
DROP INDEX "year_history_pk";--> statement-breakpoint
ALTER TABLE "budgetingapp_categories" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "budgetingapp_month_history" ALTER COLUMN "income" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "budgetingapp_month_history" ALTER COLUMN "expense" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "budgetingapp_periods" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "budgetingapp_periods" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "budgetingapp_periods" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "budgetingapp_periods" ALTER COLUMN "updateAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "budgetingapp_periods" ALTER COLUMN "start" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "budgetingapp_periods" ALTER COLUMN "end" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "budgetingapp_transactions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "budgetingapp_transactions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "budgetingapp_transactions" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "budgetingapp_transactions" ALTER COLUMN "updateAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "budgetingapp_transactions" ALTER COLUMN "amount" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "budgetingapp_transactions" ALTER COLUMN "date" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "budgetingapp_year_history" ALTER COLUMN "income" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "budgetingapp_year_history" ALTER COLUMN "expense" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "budgetingapp_periods" ADD COLUMN "type" text NOT NULL;