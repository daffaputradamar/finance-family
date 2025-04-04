import db from "@/src/db";
import { transactions } from "@/src/db/schema";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq, gte, lte, sql } from "drizzle-orm";

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
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

async function getBalanceStats(userId: string, from: Date, to: Date) {
  const totals = await db
    .select({
      type: transactions.type,
      isPaidOff: transactions.isPaidOff,
      total: sql<number>`sum(${transactions.amount})`.as('total')
    })
    .from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      gte(transactions.date, from),
      lte(transactions.date, to)
    ))
    .groupBy(transactions.type, transactions.isPaidOff);

  const expenses = totals.filter(t => t.type === "expense");
  return {
    expense: expenses.reduce((sum, entry) => sum + (entry.total || 0), 0),
    income: totals.find((t) => t.type === "income")?.total || 0,
    debt: expenses.find((t) => t.type === "expense" && t.isPaidOff === false)?.total || 0,
  };
}
