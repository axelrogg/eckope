import { z } from "zod";

export const districtContainsPointRequestQuerySchema = z.strictObject({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
});

export type DistrictContainsPointRequestQuerySchema = z.infer<
    typeof districtContainsPointRequestQuerySchema
>;
