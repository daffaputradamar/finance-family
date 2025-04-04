import db from "@/src/db";
import { periods } from "@/src/db/schema";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const periodsList = await db
    .select()
    .from(periods)
    .where(eq(periods.userId, user.id))
    .orderBy(desc(periods.createdAt));

  return Response.json(periodsList);
}

