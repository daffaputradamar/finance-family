import db from "@/src/db";
import { transactions } from "@/src/db/schema";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq, gte, lte, sql, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );
  return Response.json(stats);
}

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const stats = await db
    .select({
      type: transactions.type,
      category: transactions.category,
      categoryIcon: transactions.categoryIcon,
      _sum: {
        amount: sql<number>`sum(${transactions.amount})`.as('amount')
      }
    })
    .from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      gte(transactions.date, from),
      lte(transactions.date, to)
    ))
    .groupBy(transactions.type, transactions.category, transactions.categoryIcon)
    .orderBy(desc(sql`sum(${transactions.amount})`));

  return stats;
}
