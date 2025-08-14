import z from "zod";
import { formatRequestQueryField, GEO_NAME_LENGTH } from "./constants";

export const departmentRequestQuerySchema = z.strictObject({
    code: z
        .string()
        .length(2)
        .refine((val) => /^\d{2}$/.test(val), {
            message: "Department code must be exactly 2 digits (00-99)",
        })
        .optional(),
    name: z.string().min(1).max(GEO_NAME_LENGTH).trim().optional(),
    format: formatRequestQueryField,
});

export type DepartmentRequestQuerySchemaType = z.infer<
    typeof departmentRequestQuerySchema
>;
