import { useQuery } from "@tanstack/react-query";
import PeriodPicker from "../../_components/PeriodPicker";
import { useCallback } from "react";
import CreateCategoryDialog from "../../_components/CreateCategoryDialog";
import CreatePeriodDialog from "../../_components/CreatePeriodDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import SkeletonWrapper from "@/components/SkeletonWrapper";

interface Props {
}
  
  export function PeriodCard({ }: Props) {

    // const handlePeriodChange = useCallback(
    //     (period: Period) => {
    //       setDateRange({from: period.start, to: period.end})
    //     }, [setDateRange]
    //   )
    
      const periodsQuery = useQuery({
        queryKey: ["periods"],
        queryFn: () =>
          fetch(`/api/periods`).then((res) => res.json()),
      });

    return (
      <SkeletonWrapper isLoading={periodsQuery.isLoading}>
        <Card>
        <CardHeader className="flex">
          <CardTitle>
            <div className="flex justify-between items-center">
              Period
              <CreatePeriodDialog successCallback={() => {}} trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create Period
                </Button>
              }/>
            </div>
          </CardTitle>
          <CardDescription>
            Set your default period filter
          </CardDescription>
          
        </CardHeader>
        <CardContent>
          <PeriodPicker isLoading={periodsQuery.isLoading} periods={periodsQuery.data}  onChange={() => {}} align="start" />
        </CardContent>
      </Card>
      </SkeletonWrapper>
    )
  }
