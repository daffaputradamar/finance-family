"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function UpdatePaidOffTransaction(id: string) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) {
    throw new Error("bad request");
  }

  await prisma.$transaction([
    // Delete transaction from db
    prisma.transaction.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isLoaned: !transaction.isLoaned
      }
    }),
    
  ]);
}
