"use client";

import CategoriesStats from "@/app/(dashboard)/_components/CategoriesStats";
import StatsCards from "@/app/(dashboard)/_components/StatsCards";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { Period, UserSetting } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import PeriodPicker from "./PeriodPicker";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";


function Overview({ userSettings }: { userSettings: UserSetting }) {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  
  const handlePeriodChange = useCallback(
    (period: Period) => {
      setDateRange({from: period.start, to: period.end})
    }, [setDateRange]
  )

  const periodsQuery = useQuery({
    queryKey: ["periods"],
    queryFn: () =>
      fetch(`/api/periods`).then((res) => res.json()),
  });

  useEffect(() => {
    if(periodsQuery.isSuccess) {
      let data: Period = periodsQuery.data?.find((x: Period) => x.isDefault)
      if(data) {
        setDateRange({
          from: data.start,
          to: data.end
        })
      }
    }
  }, [periodsQuery.isSuccess])

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          {<PeriodPicker isLoading={periodsQuery.isLoading} onChange={handlePeriodChange} periods={periodsQuery.data} />}
          
          {/* <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              // We update the date range only if both dates are set

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          /> */}
        </div>
      </div>
      <div className="container flex w-full flex-col gap-2">
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />

        <CategoriesStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
}

export default Overview;
