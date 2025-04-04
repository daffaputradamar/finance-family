"use server";

import { DateToUTCDate } from "@/lib/helpers";
import db from "@/src/db";
import { periods } from "@/src/db/schema";
import {
    CreatePeriodSchema,
    CreatePeriodSchemaType,
} from "@/schema/period";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function CreatePeriod(form: CreatePeriodSchemaType) {
    const parsedBody = CreatePeriodSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("bad request");
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const [periodExists] = await db
        .select()
        .from(periods)
        .where(eq(periods.userId, user.id))
        .limit(1);

    const { name, start, end, isDefault } = parsedBody.data;
    let _end = DateToUTCDate(end);
    _end.setUTCHours(23, 59, 59, 999);
    let _start = DateToUTCDate(start);
    _start.setDate(_start.getDate() + 1)
    _start.setUTCHours(0, 0, 0, 0);

    const [newPeriod] = await db
        .insert(periods)
        .values({
            type: "PERIOD",
            id: crypto.randomUUID(),
            userId: user.id,
            name,
            start: _start,
            end: _end,
            isDefault: (!periodExists && !isDefault) ? true : isDefault,
        })
        .returning();

    return newPeriod;
}