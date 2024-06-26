import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await prisma.userSetting.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSetting.create({
      data: {
        userId: user.id,
        currency: "IDR",
      },
    });
  }

  // Revalidate the home page that uses the user currency
  revalidatePath("/");
  return Response.json(userSettings);
}
