import z from "zod";
import { formatRequestQueryField, GEO_NAME_LENGTH } from "./constants";

export const provinceRequestQuerySchema = z.strictObject({
    code: z
        .string()
        .length(4)
        .refine((val) => /^\d{4}$/.test(val), {
            message: "Province code must be exactly 4 digits (0000 - 9999)",
        })
        .optional(),
    name: z.string().min(1).max(GEO_NAME_LENGTH).trim().optional(),
    departmentCode: z
        .string()
        .length(2)
        .refine((val) => /^\d{2}$/.test(val), {
            message: "Department code must be a exactly 2 digits (00 - 99)",
        })
        .optional(),
    departmentName: z.string().min(1).max(GEO_NAME_LENGTH).trim().optional(),
    format: formatRequestQueryField,
});

export type ProvinceRequestQuerySchemaType = z.infer<typeof provinceRequestQuerySchema>;
