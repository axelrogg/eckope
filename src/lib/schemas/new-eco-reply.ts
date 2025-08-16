import z from "zod";
import { ECO_CONTENT_MAX_LENGTH, ECO_CONTENT_MIN_LENGTH } from "./constants";

export const newEcoReplyFormSchema = z.object({
    userId: z.uuidv4(),
    content: z.string().min(ECO_CONTENT_MIN_LENGTH).max(ECO_CONTENT_MAX_LENGTH),
    ecoId: z.uuidv4(),
});

export type NewEcoReplyFormSchemaType = z.infer<typeof newEcoReplyFormSchema>;

export const newEcoReplyFormDefaultValues: NewEcoReplyFormSchemaType = {
    userId: "",
    content: "",
    ecoId: "",
};
