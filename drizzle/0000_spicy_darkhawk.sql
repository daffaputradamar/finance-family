CREATE TABLE "budgetingapp_categories" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"userId" text NOT NULL,
	"icon" text NOT NULL,
	"type" text DEFAULT 'income' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budgetingapp_month_history" (
	"userId" text NOT NULL,
	"day" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"income" numeric NOT NULL,
	"expense" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budgetingapp_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updateAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"start" timestamp NOT NULL,
	"end" timestamp NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budgetingapp_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updateAt" timestamp DEFAULT now() NOT NULL,
	"amount" numeric NOT NULL,
	"description" text NOT NULL,
	"date" timestamp NOT NULL,
	"userId" text NOT NULL,
	"type" text DEFAULT 'income' NOT NULL,
	"isPaidOff" boolean DEFAULT false NOT NULL,
	"category" text NOT NULL,
	"categoryIcon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budgetingapp_usersettings" (
	"userId" text PRIMARY KEY NOT NULL,
	"currency" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budgetingapp_year_history" (
	"userId" text NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"income" numeric NOT NULL,
	"expense" numeric NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_category" ON "budgetingapp_categories" USING btree ("name","userId","type");--> statement-breakpoint
CREATE UNIQUE INDEX "month_history_pk" ON "budgetingapp_month_history" USING btree ("day","month","year","userId");--> statement-breakpoint
CREATE UNIQUE INDEX "year_history_pk" ON "budgetingapp_year_history" USING btree ("month","year","userId");