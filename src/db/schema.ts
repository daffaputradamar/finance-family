import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  boolean,
  integer,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const userSettings = pgTable("budgetingapp_usersettings", {
  userId: text("userId").primaryKey(),
  currency: text("currency").notNull(),
});

export const categories = pgTable(
  "budgetingapp_categories",
  {
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 }).defaultNow().notNull(),
    name: text("name").notNull(),
    userId: text("userId").notNull(),
    icon: text("icon").notNull(),
    type: text("type").default("income").notNull(),
  },
  (table) => [{
    uniqueCategory: uniqueIndex("unique_category").on(
      table.name,
      table.userId,
      table.type
    ),
  }]
);

export const transactions = pgTable("budgetingapp_transactions", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 }).defaultNow().notNull(),
  updateAt: timestamp("updateAt", { mode: "date", precision: 3 }).defaultNow().notNull(),
  amount: doublePrecision("amount").notNull(),
  description: text("description").notNull(),
  date: timestamp("date", { mode: "date", precision: 3 }).notNull(),
  userId: text("userId").notNull(),
  type: text("type").default("income").notNull(),
  isPaidOff: boolean("isPaidOff").default(false).notNull(),
  category: text("category").notNull(),
  categoryIcon: text("categoryIcon").notNull(),
});

export const periods = pgTable("budgetingapp_periods", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 }).defaultNow().notNull(),
  updateAt: timestamp("updateAt", { mode: "date", precision: 3 }).defaultNow().notNull(),
  name: text("name").notNull(),
  start: timestamp("start", { mode: "date", precision: 3 }).notNull(),
  end: timestamp("end", { mode: "date", precision: 3 }).notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  userId: text("userId").notNull(),
  type: text("type").notNull(),
});