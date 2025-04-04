"use server";

import db from "@/src/db";
import { userSettings } from "@/src/db/schema";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [updatedSettings] = await db
    .update(userSettings)
    .set({ currency })
    .where(eq(userSettings.userId, user.id))
    .returning();

  return updatedSettings;
}
