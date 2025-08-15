import z from "zod";
import {
    ECOPIN_CONTENT_MAX_LENGTH,
    ECOPIN_CONTENT_MIN_LENGTH,
    ECOPIN_TITLE_MAX_LENGTH,
    ECOPIN_TITLE_MIN_LENGTH,
} from "./constants";

export const ecoPinUpdateSchema = z
    .strictObject({
        title: z
            .string()
            .min(ECOPIN_TITLE_MIN_LENGTH, "El título es demasiado corto.")
            .max(ECOPIN_TITLE_MAX_LENGTH, "El título es demasiado largo.")
            .trim()
            .optional(),
        content: z
            .string()
            .min(ECOPIN_CONTENT_MIN_LENGTH, "Por favor, brinda más contexto.")
            .max(ECOPIN_CONTENT_MAX_LENGTH, "La descripción es demasiado larga.")
            .trim()
            .optional(),
    })
    .check((ctx) => {
        const { content, title } = ctx.value;

        // No fields provided
        if (!(title || content)) {
            ctx.issues.push({
                code: "custom",
                message: "At least one field must be provided to update.",
                input: ctx.value,
            });
        }
    });

export type EcoPinUpdateSchemaType = z.infer<typeof ecoPinUpdateSchema>;
