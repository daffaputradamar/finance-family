"use server";

import db from "@/src/db";
import { periods } from "@/src/db/schema";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

export async function SetDefaultPeriod(id: string) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Find the period
  const [period] = await db
    .select()
    .from(periods)
    .where(and(eq(periods.userId, user.id), eq(periods.id, id)));

  if (!period) {
    throw new Error("bad request");
  }

  await db
    .update(periods)
    .set({ isDefault: false })
    .where(eq(periods.userId, user.id));
  
  // Set the selected period to isDefault = true
  await db
    .update(periods)
    .set({ isDefault: true })
    .where(and(eq(periods.id, id), eq(periods.userId, user.id)));
}
