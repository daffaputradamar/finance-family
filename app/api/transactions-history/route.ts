import { GetFormatterForCurrency } from "@/lib/helpers";
import db from "@/src/db";
import { transactions, userSettings } from "@/src/db/schema";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq, gte, lte, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const transactions = await getTransactionsHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(transactions);
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const [userSetting] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  if (!userSetting) {
    throw new Error("user settings not found");
  }

  const formatter = GetFormatterForCurrency(userSetting.currency);

  const transactionsList = await db
    .select()
    .from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      gte(transactions.date, from),
      lte(transactions.date, to)
    ))
    .orderBy(desc(transactions.date), desc(transactions.createdAt));

  return transactionsList.map((transaction) => ({
    ...transaction,
    // lets format the amount with the user currency
    formattedAmount: formatter.format(transaction.amount),
  }));
}
