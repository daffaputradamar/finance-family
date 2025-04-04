import db from "@/src/db";
import { transactions } from "@/src/db/schema";
import { Period, Timeframe } from "@/lib/types";
import { currentUser } from "@clerk/nextjs";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eq, sql, asc, and } from "drizzle-orm";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000),
});

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    month,
    year,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return Response.json(data);
}

export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
  userId: string,
  timeframe: Timeframe,
  period: Period
) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
}

type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

async function getYearHistoryData(userId: string, year: number) {
  const result = await db
    .select({
      month: sql<number>`date_part('month', ${transactions.date}) - 1`.as('month'),
      expense: sql<number>`sum(CASE WHEN type = 'expense' THEN amount ELSE 0 END)`.as('expense'),
      income: sql<number>`sum(CASE WHEN type = 'income' THEN amount ELSE 0 END)`.as('income'),
    })
    .from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      sql`date_part('year', ${transactions.date}) = ${year}`
    ))
    .groupBy(sql`date_part('month', ${transactions.date})`)
    .orderBy(sql`date_part('month', ${transactions.date})`);

  const history: HistoryData[] = [];
  for (let i = 0; i < 12; i++) {
    const month = result.find((row) => row.month === i);
    history.push({
      year,
      month: i,
      expense: month?.expense || 0,
      income: month?.income || 0,
    });
  }

  return history;
}

async function getMonthHistoryData(userId: string, year: number, month: number) {
  const result = await db
    .select({
      day: sql<number>`date_part('day', ${transactions.date})`.as('day'),
      expense: sql<number>`sum(CASE WHEN type = 'expense' THEN amount ELSE 0 END)`.as('expense'),
      income: sql<number>`sum(CASE WHEN type = 'income' THEN amount ELSE 0 END)`.as('income'),
    })
    .from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      sql`date_part('year', ${transactions.date}) = ${year}`,
      sql`date_part('month', ${transactions.date}) - 1 = ${month}`
    ))
    .groupBy(sql`date_part('day', ${transactions.date})`)
    .orderBy(sql`date_part('day', ${transactions.date})`);

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let i = 1; i <= daysInMonth; i++) {
    const day = result.find((row) => row.day === i);
    history.push({
      expense: day?.expense || 0,
      income: day?.income || 0,
      year,
      month,
      day: i,
    });
  }

  return history;
}
