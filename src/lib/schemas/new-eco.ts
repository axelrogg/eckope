import z from "zod";
import { ECO_CONTENT_MAX_LENGTH, ECO_CONTENT_MIN_LENGTH } from "./constants";

export const newEcoFormSchema = z.object({
    userId: z.uuidv4(),
    content: z.string().min(ECO_CONTENT_MIN_LENGTH).max(ECO_CONTENT_MAX_LENGTH),
    ecoPinId: z.uuidv4(),
});

export type NewEcoFormSchemaType = z.infer<typeof newEcoFormSchema>;

export const newEcoFormDefaultValues: NewEcoFormSchemaType = {
    userId: "",
    content: "",
    ecoPinId: "",
};
