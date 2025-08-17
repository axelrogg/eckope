import { User } from "next-auth";
import z from "zod";
import {
    ECO_CONTENT_MAX_LENGTH,
    ECO_CONTENT_MIN_LENGTH,
    ECOPIN_LNG_LAT_DEFAULT_VAL,
    ECOPIN_TITLE_MAX_LENGTH,
    ECOPIN_TITLE_MIN_LENGTH,
} from "./constants";

export const newEcoPinFormSchema = z
    .object({
        title: z
            .string()
            .min(ECOPIN_TITLE_MIN_LENGTH, "El título es demasiado corto.")
            .max(ECOPIN_TITLE_MAX_LENGTH, "El título es demasiado largo."),
        content: z
            .string()
            .min(ECO_CONTENT_MIN_LENGTH, "Por favor, brinda más contexto.")
            .max(ECO_CONTENT_MAX_LENGTH, "La descripción es demasiado larga."),
        category: z.string(),
        customCategory: z.string().optional(),
        location: z.object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
        }),
        userId: z.uuidv4(),
        severity: z.string(),
    })
    .check((ctx) => {
        if (
            ctx.value.category === "other" &&
            (!ctx.value.customCategory || ctx.value.customCategory.trim() === "")
        ) {
            ctx.issues.push({
                code: "custom",
                path: ["customCategory"],
                message: "Por favor, indica la categoría.",
                input: ctx.value,
            });
        }
        if (
            ctx.value.location.lat === ECOPIN_LNG_LAT_DEFAULT_VAL ||
            ctx.value.location.lng === ECOPIN_LNG_LAT_DEFAULT_VAL
        ) {
            ctx.issues.push({
                code: "custom",
                message: "Por favor selecciona una ubicación válida",
                path: ["location"],
                input: ctx.value,
            });
        }
    });

export type NewEcoPinFormSchemaType = z.infer<typeof newEcoPinFormSchema>;

export const newEcoPinFormDefaultValues = (user: User | null) => ({
    userId: user ? user.id : "",
    title: "",
    category: "",
    customCategory: "",
    location: {
        lat: ECOPIN_LNG_LAT_DEFAULT_VAL,
        lng: ECOPIN_LNG_LAT_DEFAULT_VAL,
    },
    content: "",
    severity: "",
});
