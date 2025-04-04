"use server";

import db from "@/src/db";
import { categories } from "@/src/db/schema";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;
  const [newCategory] = await db.insert(categories)
    .values({
      userId: user.id,
      name,
      icon,
      type,
    })
    .returning();

  return newCategory;
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [deletedCategory] = await db.delete(categories)
    .where(
      and(
        eq(categories.userId, user.id),
        eq(categories.name, parsedBody.data.name),
        eq(categories.type, parsedBody.data.type)
      )
    )
    .returning();

  return deletedCategory;
}
