import z from "zod";

export const GEO_NAME_LENGTH = 255;

export const formatRequestQueryField = z
    .string()
    .toLowerCase()
    .transform((val) => val || "json")
    .refine((val) => !val || ["json", "geojson"].includes(val), {
        message:
            "Output format must be either 'json' or 'geojson' (defaults to 'json' if empty)",
    })
    .optional();

export const idRequestSearchParamSchema = z.strictObject({
    id: z.uuid(),
});
