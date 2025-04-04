"use server";

import db from "@/src/db";
import { transactions } from "@/src/db/schema";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

export async function UpdatePaidOffTransaction(id: string) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [transaction] = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.userId, user.id), eq(transactions.id, id)));

  if (!transaction) {
    throw new Error("bad request");
  }

  await db
    .update(transactions)
    .set({ isPaidOff: !transaction.isPaidOff })
    .where(and(
      eq(transactions.id, id),
      eq(transactions.userId, user.id)
    ));
}
