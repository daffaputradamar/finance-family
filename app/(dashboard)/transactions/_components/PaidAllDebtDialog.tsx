"use client";

import { DeleteTransaction } from "@/app/(dashboard)/transactions/_actions/deleteTransaction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { UpdateAllPaidOffTransaction } from "../_actions/updateAllPaidOffTransaction";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function PaidAllDebtDialog({ open, setOpen }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateAllPaidOffTransaction,
    onSuccess: async () => {
      toast.success("Status Paid off updated successfully", {
        id: 'updateAllPaidOff',
      });

      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["overview", "stats"],
      });

      setOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: 'updateAllPaidOff',
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will update all Paid off to true
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Updating transaction...", {
                id: 'updateAllPaidOff',
              });
              mutate();
            }}
            disabled={isPending}
          >
            {!isPending && "Continue"}
            {isPending && <Loader2 className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PaidAllDebtDialog;
