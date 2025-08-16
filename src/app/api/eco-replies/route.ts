import { NextAuthRequest } from "next-auth";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import z from "zod";

import db from "@/lib/database/db";
import { ecoReplies, ecos, usersInNextAuth } from "@root/drizzle/schema";
import { parseApiRequestBody } from "@/lib/utils/api/parse-api-request-body";
import { httpErrorResponse, httpSuccessResponse } from "@/lib/http/response";
import { newEcoReplyFormSchema } from "@/lib/schemas/new-eco-reply";

const INSTANCE_PATH = "/api/eco-replies";

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Unauthorized",
            status: 401,
            detail: "Authentication required to access this resource.",
            errors: {
                code: 123, // Custom error code for "missing authentication"
            },
            instance: INSTANCE_PATH,
        });
    }

    const { data: reqBodyData, error: reqBodyError } = await parseApiRequestBody(req);

    if (reqBodyError) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid request body",
            status: 400,
            detail: "The request body must be valid JSON.",
            errors: {
                code: 123, // Specific code for JSON parse errors
                details: reqBodyError,
            },
            instance: INSTANCE_PATH,
        });
    }

    const parsedBodyResult = newEcoReplyFormSchema.safeParse(reqBodyData);
    if (!parsedBodyResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                details: z.treeifyError(parsedBodyResult.error),
            },
            instance: INSTANCE_PATH,
        });
    }

    const data = parsedBodyResult.data;
    try {
        const result = await db.transaction(async (tx) => {
            const [inserted] = await tx
                .insert(ecoReplies)
                .values({
                    content: data.content,
                    userId: data.userId,
                    ecoId: data.ecoId,
                })
                .returning({
                    id: ecos.id,
                });

            const [ecoReply] = await tx
                .select({
                    id: ecoReplies.id,
                    ecoId: ecoReplies.ecoId,
                    content: ecoReplies.content,
                    edited: ecoReplies.edited,
                    upvotes: ecoReplies.upvotes,
                    downvotes: ecoReplies.downvotes,
                    createdAt: ecoReplies.createdAt,
                    updatedAt: ecoReplies.updatedAt,
                    author: {
                        id: usersInNextAuth.id,
                        email: usersInNextAuth.email,
                        name: usersInNextAuth.name,
                        image: usersInNextAuth.image,
                    },
                })
                .from(ecoReplies)
                .where(eq(ecoReplies.id, inserted.id))
                .innerJoin(usersInNextAuth, eq(ecoReplies.userId, usersInNextAuth.id));
            return ecoReply;
        });
        return httpSuccessResponse({
            action: "fetched",
            instance: INSTANCE_PATH,
            data: result,
        });
    } catch (error) {
        return httpErrorResponse({
            status: 500,
            title: "Internal Server Error",
            detail: "An unexpected error occurred while creating the eco.",
            type: "about:blank",
            instance: INSTANCE_PATH,
            errors: {
                code: 123,
                message: error instanceof Error ? error.message : String(error),
            },
        });
    }
});
