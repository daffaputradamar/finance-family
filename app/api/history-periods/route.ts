import db from "@/src/db";
import { transactions } from "@/src/db/schema";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq, asc, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const periods = await getHistoryPeriods(user.id);
  return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await db
    .select({
      year: sql<number>`date_part('year', ${transactions.date})`.as('year')
    })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .groupBy(sql`date_part('year', ${transactions.date})`)
    .orderBy(asc(sql`date_part('year', ${transactions.date})`));

  const years = result.map((el) => el.year);
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
}
