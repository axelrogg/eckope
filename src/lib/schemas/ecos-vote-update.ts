import z from "zod";

export const ecosVoteUpdateSchema = z
    .strictObject({
        upvote: z.boolean().optional(),
        downvote: z.boolean().optional(),
    })
    .check((ctx) => {
        const { upvote, downvote } = ctx.value;

        // Prevent simultaneous upvote and downvote
        if (upvote === true && downvote === true) {
            ctx.issues.push({
                code: "custom",
                message: "Cannot upvote and downvote simultaneously.",
                input: ctx.value,
                path: ["upvote"],
            });
            ctx.issues.push({
                code: "custom",
                message: "Cannot upvote and downvote simultaneously.",
                input: ctx.value,
                path: ["downvote"],
            });
        }
    });

export type EcosVoteUpdateSchema = z.infer<typeof ecosVoteUpdateSchema>;
