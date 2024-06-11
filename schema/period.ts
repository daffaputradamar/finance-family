import { z } from "zod";

export const CreatePeriodSchema = z.object({
  name: z.string().min(3).max(20),
  start: z.date(),
  end: z.date(),
  isDefault: z.boolean().default(false),
});

export type CreatePeriodSchemaType = z.infer<typeof CreatePeriodSchema>;

// export const DeletePeriodSchema = z.object({
//   name: z.string().min(3).max(20),
//   type: z.enum(["income", "expense"]),
// });

// export type DeletePeriodSchemaType = z.infer<typeof DeletePeriodSchema>;
