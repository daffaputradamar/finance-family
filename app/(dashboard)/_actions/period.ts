"use server";

import { DateToUTCDate } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import {
    CreatePeriodSchema,
    CreatePeriodSchemaType,
} from "@/schema/period";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function CreatePeriod(form: CreatePeriodSchemaType) {
    const parsedBody = CreatePeriodSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("bad request");
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const periodExists = await prisma.period.findFirst({
        where: {
            userId: user.id
        }
    })
    

    const { name, start, end, isDefault } = parsedBody.data;
    let _end = DateToUTCDate(end);
    _end.setUTCHours(23, 59, 59, 999);
    let _start = DateToUTCDate(start);
    _start.setUTCHours(0, 0, 0, 0);
    return await prisma.period.create({
        data: {
            userId: user.id,
            name,
            start: _start,
            end: _end,
            isDefault: (!periodExists && !isDefault) ? true : isDefault,
        },
    });
}