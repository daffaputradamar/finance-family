"use server";

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
    return await prisma.period.create({
        data: {
            userId: user.id,
            name,
            start,
            end,
            isDefault: (!periodExists && !isDefault) ? true : isDefault,
        },
    });
}