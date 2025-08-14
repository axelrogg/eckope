import { NextAuthRequest } from "next-auth";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";
import z from "zod";

import db from "@/lib/database/db";
import { ecoPins, ecoPinVotes } from "@root/drizzle/schema";
import { httpErrorResponse, httpSuccessResponse } from "@/lib/http/response";
import { ecosVoteUpdateSchema } from "@/lib/schemas/ecos-vote-update";
import { handleEcoPinVote } from "@/lib/utils/api/handle-ecos-vote";
import { parseApiRequestBody } from "@/lib/utils/api/parse-api-request-body";
import { idRequestSearchParamSchema } from "@/lib/schemas/geo/constants";
import { ApiAction } from "@/types/api/http-response";

const INSTANCE_PATH = "/api/eco-pins/{id:uuid}/votes";

export const GET = auth(async function GET(
    req: NextAuthRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const searchParams = await params;

    const parsedSearchParamsResult = idRequestSearchParamSchema.safeParse(searchParams);

    if (!parsedSearchParamsResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(parsedSearchParamsResult.error),
            },
            instance: INSTANCE_PATH,
        });
    }

    const ecoPinId = parsedSearchParamsResult.data.id;
    const authed = req.auth;

    if (!authed) {
        try {
            const [votes] = await db
                .select({
                    id: ecoPins.id,
                    upvotes: ecoPins.upvotes,
                    downvotes: ecoPins.downvotes,
                })
                .from(ecoPins)
                .where(eq(ecoPins.id, ecoPinId));
            if (!votes) {
                return httpErrorResponse({
                    type: "about:blank",
                    title: "Not Found",
                    status: 404,
                    detail: `Eco pin with id "${ecoPinId}" was not found.`,
                    errors: {
                        code: 123,
                        details: `Eco pin with id "${ecoPinId}" was not found.`,
                    },
                    instance: INSTANCE_PATH,
                });
            }

            return httpSuccessResponse({
                action: "fetched",
                data: votes,
                instance: INSTANCE_PATH,
            });
        } catch (error) {
            return httpErrorResponse({
                type: "about:blank",
                title: "Internal Server Error",
                status: 500,
                detail: "An unexpected error occurred during the update.",
                errors: {
                    code: 500,
                    details: error instanceof Error ? error.message : String(error),
                },
                instance: INSTANCE_PATH,
            });
        }
    }

    try {
        const result = await db.transaction(async (tx) => {
            const [existingVote] = await tx
                .select()
                .from(ecoPinVotes)
                .where(
                    and(
                        eq(ecoPinVotes.ecoPinId, ecoPinId),
                        eq(ecoPinVotes.userId, authed.user.id)
                    )
                );
            const [voteCount] = await tx
                .select({
                    id: ecoPins.id,
                    upvotes: ecoPins.upvotes,
                    downvotes: ecoPins.downvotes,
                })
                .from(ecoPins)
                .where(and(eq(ecoPins.id, ecoPinId), eq(ecoPins.userId, authed.user.id)));

            return {
                vote: {
                    status: existingVote ? true : false,
                    voteType: existingVote ? existingVote.voteType : null,
                },
                ecoPin: {
                    id: voteCount.id,
                    upvotes: voteCount.upvotes,
                    downvotes: voteCount.downvotes,
                },
            };
        });

        if (!result.ecoPin) {
            return httpErrorResponse({
                type: "about:blank",
                title: "Not Found",
                status: 404,
                detail: `Eco pin with id "${ecoPinId}" was not found.`,
                errors: {
                    code: 123,
                    details: `Eco pin with id "${ecoPinId}" was not found.`,
                },
                instance: INSTANCE_PATH,
            });
        }
        return httpSuccessResponse({
            action: "fetched",
            data: result,
            instance: INSTANCE_PATH,
        });
    } catch (error) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Internal Server Error",
            status: 500,
            detail: "An unexpected error occurred during the update.",
            errors: {
                code: 500,
                details: error instanceof Error ? error.message : String(error),
            },
            instance: INSTANCE_PATH,
        });
    }
});

export const POST = auth(async function POST(
    req: NextAuthRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const searchParams = await params;

    const parsedSearchParamsResult = idRequestSearchParamSchema.safeParse(searchParams);

    if (!parsedSearchParamsResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(parsedSearchParamsResult.error),
            },
            instance: INSTANCE_PATH,
        });
    }

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

    const parsedBodyResult = ecosVoteUpdateSchema.safeParse(reqBodyData);
    if (!parsedBodyResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid request body",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(parsedBodyResult.error),
            },
            instance: INSTANCE_PATH,
        });
    }

    const ecoPinId = parsedSearchParamsResult.data.id;
    const userId = req.auth.user.id;
    const { upvote } = parsedBodyResult.data;

    if (upvote) {
        try {
            const result = await db.transaction(async (tx) => {
                return await handleEcoPinVote({
                    tx,
                    id: ecoPinId,
                    userId,
                    voteType: "up",
                });
            });

            return httpSuccessResponse({
                action: result.action as ApiAction,
                status: (result.action as ApiAction) === "created" ? 201 : 200,
                instance: INSTANCE_PATH,
                data: {
                    ...result.data,
                    ...result.vote,
                },
            });
        } catch (error) {
            return httpErrorResponse({
                type: "about:blank",
                title: "Internal Server Error",
                status: 500,
                detail: "An unexpected error occurred during the update.",
                errors: {
                    code: 500,
                    details: error instanceof Error ? error.message : String(error),
                },
                instance: INSTANCE_PATH,
            });
        }
    } else {
        // Because of `ecosVoteApiPatchSchema` we are assured that either `upvote` or `downvote` is `true`.
        // So if `upvote` is not true, it must be that `downvote` is `true`.
        try {
            const result = await db.transaction(async (tx) => {
                return await handleEcoPinVote({
                    tx,
                    id: ecoPinId,
                    userId,
                    voteType: "down",
                });
            });

            return httpSuccessResponse({
                action: result.action as ApiAction,
                status: (result.action as ApiAction) === "created" ? 201 : 200,
                instance: INSTANCE_PATH,
                data: {
                    ...result.data,
                    ...result.vote,
                },
            });
        } catch (error) {
            return httpErrorResponse({
                type: "about:blank",
                title: "Internal Server Error",
                status: 500,
                detail: "An unexpected error occurred during the update.",
                errors: {
                    code: 500,
                    details: error instanceof Error ? error.message : String(error),
                },
                instance: INSTANCE_PATH,
            });
        }
    }
});
