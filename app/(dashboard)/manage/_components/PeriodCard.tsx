"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PeriodPicker from "../../_components/PeriodPicker";
import { useCallback } from "react";
import CreateCategoryDialog from "../../_components/CreateCategoryDialog";
import CreatePeriodDialog from "../../_components/CreatePeriodDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { SetDefaultPeriod } from "../_actions/setDefaultPeriod";
import { toast } from "sonner";
import { Period } from "@prisma/client";

interface Props {
}

export function PeriodCard({ }: Props) {
  const queryClient = useQueryClient();

  const updateDefaultPeriod = useMutation({
    mutationFn: SetDefaultPeriod,
    onSuccess: async () => {
      toast.success("Default Period Successfully Updated", {
        id: "updateDefaultPeriod",
      });

      await queryClient.invalidateQueries({
        queryKey: ["periods"],
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "updateDefaultPeriod",
      });
    },
  });

  const handlePeriodChange = (period: Period, isNeedUpdate: boolean = false) => {
    if(!isNeedUpdate) return

    toast.loading("Updating default period...", {
      id: "updateDefaultPeriod",
    });

    updateDefaultPeriod.mutate(period.id);
  }

  return (
    // <SkeletonWrapper isLoading={queryClient}>
      <Card>
        <CardHeader className="flex">
          <CardTitle>
            <div className="flex justify-between items-center">
              Period
              <CreatePeriodDialog successCallback={() => { }} trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create Period
                </Button>
              } />
            </div>
          </CardTitle>
          <CardDescription>
            Set your default period filter
          </CardDescription>

        </CardHeader>
        <CardContent>
          <PeriodPicker onChange={handlePeriodChange} align="start" />
        </CardContent>
      </Card>
    // </SkeletonWrapper>
  )
}
