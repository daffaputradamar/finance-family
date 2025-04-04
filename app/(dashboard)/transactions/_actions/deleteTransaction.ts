"use server";

import db from "@/src/db";
import { transactions } from "@/src/db/schema";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";

export async function DeleteTransaction(id: string) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Delete transaction
  await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, user.id)));
}
