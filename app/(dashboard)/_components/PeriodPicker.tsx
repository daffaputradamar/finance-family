"use client";

import CreateCategoryDialog from "@/app/(dashboard)/_components/CreateCategoryDialog";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Category, Period } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getDate, startOfMonth } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const formatDate = (date: Date, format: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }, locale: string = "en-us"): string => {
    return new Date(date).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

interface Props {
  periods: Period[];
  isLoading: boolean;
  onChange: (period: Period) => void;
  align?:  "end" | "center" | "start" | undefined
}

function PeriodPicker({ onChange, periods, isLoading, align = "end" }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState((periods ?? []).find(x => x.isDefault));

  useEffect(() => {
    if (!value) return;
    // when the value changes, call onChange callback
    onChange(value);
  }, [onChange, value]);

  useEffect(() => {
    setValue((periods ?? []).find(x => x.isDefault))
  }, [periods])
//   const successCallback = useCallback(
//     (period: Period) => {
//       setValue(period.id);
//       setOpen((prev) => !prev);
//     },
//     [setValue, setOpen]
//   );

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start"
          >
            {value ? (
              <span>{value.name}</span>
            ) : (
              "Select Period"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-100 p-0" align={align}>
          <Command
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <CommandInput placeholder="Search Period..." />
            <CommandEmpty>
              <p>Period not found</p>
              <p className="text-xs text-muted-foreground">
                Tip: Create a new period
              </p>
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {periods &&
                  periods.map((period: Period) => (
                    <CommandItem
                      key={period.id}
                      onSelect={() => {
                        setValue(period);
                        setOpen((prev) => !prev);
                      }}
                    >
                      <PeriodRow period={period} />
                      <Check
                        className={cn(
                          "mr-2 ml-4 w-4 h-4 opacity-0",
                          (value?.id) === period.id && "opacity-100"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </SkeletonWrapper>
  );
}

export default PeriodPicker;

function PeriodRow({ period }: { period: Period }) {
  return (
    <div className="">
      <div>{period.name}</div>
      <div>({formatDate(period.start, {month:"2-digit", year: "numeric", day:"2-digit"}, "id-ID")} - {formatDate(period.end, {month:"2-digit", year: "numeric", day:"2-digit"}, "id-ID")})</div>
    </div>
  );
}
