"use server";

import db from "@/src/db";
import { categories, transactions } from "@/src/db/schema";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type, isPaidOff } = parsedBody.data;
  
  const [categoryRow] = await db
    .select()
    .from(categories)
    .where(and(
      eq(categories.userId, user.id),
      eq(categories.name, category)
    ))
    .limit(1);

  if (!categoryRow) {
    throw new Error("category not found");
  }

  // Create user transaction
  await db
    .insert(transactions)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
      amount,
      date,
      description: description || "",
      type,
      category: categoryRow.name,
      categoryIcon: categoryRow.icon,
      isPaidOff
    });
}
