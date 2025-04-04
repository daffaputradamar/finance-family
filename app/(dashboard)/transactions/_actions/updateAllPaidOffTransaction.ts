"use server";

import db from "@/src/db";
import { transactions } from "@/src/db/schema";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

export async function UpdateAllPaidOffTransaction() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  await db
    .update(transactions)
    .set({ isPaidOff: true })
    .where(and(
      eq(transactions.userId, user.id),
      eq(transactions.isPaidOff, false)
    ));
}
