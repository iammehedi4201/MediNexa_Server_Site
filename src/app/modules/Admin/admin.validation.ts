import { UserGender } from "@prisma/client";
import z from "zod";

const adminInfoUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    gender: z
      .enum(Object.values(UserGender) as [string, ...string[]])
      .optional(),
    contactNo: z.string().optional(),
  }),
});

export const adminValidationSchema = {
  adminInfoUpdateSchema,
};
