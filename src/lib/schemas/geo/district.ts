import z from "zod";
import { formatRequestQueryField, GEO_NAME_LENGTH } from "./constants";

export const districtRequestQuerySchema = z.strictObject({
    ubigeo: z
        .string()
        .length(6)
        .refine((val) => /^\d{6}$/.test(val), {
            message: "Ubigeo must be exactly 6 digits (000000-999999)",
        })
        .optional(),
    name: z.string().min(1).max(GEO_NAME_LENGTH).trim().optional(),
    departmentCode: z
        .string()
        .length(2)
        .refine((val) => /^\d{2}$/.test(val), {
            message: "Department code must be exactly 2 digits (00-99)",
        })
        .optional(),
    departmentName: z.string().trim().optional(),
    provinceCode: z
        .string()
        .length(4)
        .refine((val) => /^\d{4}$/.test(val), {
            message: "Province code must be exactly 4 digits (0000 - 9999)",
        })
        .optional(),
    provinceName: z.string().length(GEO_NAME_LENGTH).trim().optional(),
    format: formatRequestQueryField,
});

export type DistrictRequestQuerySchemaType = z.infer<typeof districtRequestQuerySchema>;
