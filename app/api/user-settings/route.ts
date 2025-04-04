import db from "@/src/db";
import { userSettings } from "@/src/db/schema";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let [userSetting] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, user.id));

  if (!userSetting) {
    const [newUserSetting] = await db
      .insert(userSettings)
      .values({
        userId: user.id,
        currency: "IDR",
      })
      .returning();
    userSetting = newUserSetting;
  }

  // Revalidate the home page that uses the user currency
  revalidatePath("/");
  return Response.json(userSetting);
}
