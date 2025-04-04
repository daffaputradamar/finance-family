import db from "@/src/db";
import { categories } from "@/src/db/schema";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { and, eq, asc } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  const validator = z.enum(["expense", "income"]).nullable();

  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;
  const whereConditions = [eq(categories.userId, user.id)];
  if (type) {
    whereConditions.push(eq(categories.type, type));
  }

  const categoriesList = await db
    .select()
    .from(categories)
    .where(and(...whereConditions))
    .orderBy(asc(categories.name));

  return Response.json(categoriesList);
}
