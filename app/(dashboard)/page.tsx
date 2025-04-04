import CreateTransactionDialog from "@/app/(dashboard)/_components/CreateTransactionDialog";
import History from "@/app/(dashboard)/_components/History";
import Overview from "@/app/(dashboard)/_components/Overview";
import { Button } from "@/components/ui/button";
import db from "@/src/db";
import { userSettings } from "@/src/db/schema";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import React from "react";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [userSetting] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, user.id));

  if (!userSetting) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-100 hover:bg-emerald-500 hover:text-white dark:border-emerald-500 dark:bg-emerald-950 dark:text-white dark:hover:bg-emerald-700 dark:hover:text-white"
                >
                  New Income 🤑
                </Button>
              }
              type="income"
            />

            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-100 hover:bg-rose-500 hover:text-white dark:border-rose-500 dark:bg-rose-950 dark:text-white dark:hover:bg-rose-700 dark:hover:text-white"
                >
                  New Expense 😤
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSetting} />
      <History userSettings={userSetting} />
    </div>
  );
}

export default page;
