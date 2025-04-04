"use server";

import db from "@/src/db";
import { categories, transactions } from "@/src/db/schema";
import { CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

export async function UpdateTransaction(id: string, form: CreateTransactionSchemaType) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [categoryRow] = await db
    .select()
    .from(categories)
    .where(and(
      eq(categories.userId, user.id),
      eq(categories.name, form.category)
    ))
    .limit(1);

  if (!categoryRow) {
    throw new Error("category not found");
  }

  await db
    .update(transactions)
    .set({
      amount: form.amount,
      date: form.date,
      description: form.description || "",
      type: form.type,
      category: categoryRow.name,
      categoryIcon: categoryRow.icon,
      isPaidOff: form.isPaidOff
    })
    .where(and(
      eq(transactions.id, id),
      eq(transactions.userId, user.id)
    ));
}