-- CreateTable
CREATE TABLE "budgetingapp_usersettings" (
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "budgetingapp_usersettings_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "budgetingapp_categories" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'income'
);

-- CreateTable
CREATE TABLE "budgetingapp_transactions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'income',
    "category" TEXT NOT NULL,
    "categoryIcon" TEXT NOT NULL,

    CONSTRAINT "budgetingapp_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgetingapp_month_history" (
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "expense" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "budgetingapp_month_history_pkey" PRIMARY KEY ("day","month","year","userId")
);

-- CreateTable
CREATE TABLE "budgetingapp_year_history" (
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "expense" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "budgetingapp_year_history_pkey" PRIMARY KEY ("month","year","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "budgetingapp_categories_name_userId_type_key" ON "budgetingapp_categories"("name", "userId", "type");
