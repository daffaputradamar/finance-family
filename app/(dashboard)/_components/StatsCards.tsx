"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSetting } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet, HandCoins } from "lucide-react";
import React, { ReactNode, useCallback, useMemo, useState } from "react";
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";
import PaidAllDebtDialog from "@/app/(dashboard)/transactions/_components/PaidAllDebtDialog";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSetting;
}

function StatsCards({ from, to, userSettings }: Props) {
  // Add this state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () => {
      return fetch(
        `/api/stats/balance?from=${from}&to=${to}`
      ).then((res) => res.json())
    }
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const debt = statsQuery.data?.debt || 0;

  const balance = income - expense;

  return (
    <div className="relative grid w-full gap-2 grid-cols-2 md:grid-cols-4">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={debt}
          title="Debt Amount"
          icon={
            <HandCoins className="h-12 w-12 items-center rounded-lg p-2 text-amber-500 bg-violet-400/10" />
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setIsDialogOpen(true)}
            >
              Paid All
            </Button>
          }
        />
        <PaidAllDebtDialog
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

// Modify StatCard to accept action prop
function StatCard({
  formatter,
  value,
  title,
  icon,
  action,
}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: String;
  value: number;
  action?: ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">{title}</p>
          {action}
        </div>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
