"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function UpdateAllPaidOffTransaction() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }


  await prisma.$transaction([
    prisma.transaction.updateMany({
      where: {
        isPaidOff: false,
        userId: user.id,
      },
      data: {
        isPaidOff: true
      }
    }),
    
  ]);
}
