"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function SetDefaultPeriod(id: string) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const period = await prisma.period.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!period) {
    throw new Error("bad request");
  }

  await prisma.$transaction([
    // Delete transaction from db
    prisma.period.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          isDefault: false
        }
    }),
      
    prisma.period.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isDefault: true
      }
    }),
    
  ]);
}
