import { NextAuthRequest } from "next-auth";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";
import z from "zod";

import db from "@/lib/database/db";
import { ecoReplies, ecoReplyVotes } from "@root/drizzle/schema";
import { httpErrorResponse, httpSuccessResponse } from "@/lib/http/response";
import { ecosVoteUpdateSchema } from "@/lib/schemas/ecos-vote-update";
import { idRequestSearchParamSchema } from "@/lib/schemas/geo/constants";
import { handleEcoReplyVote } from "@/lib/utils/api/handle-ecos-vote";
import { parseApiRequestBody } from "@/lib/utils/api/parse-api-request-body";
import { ApiAction } from "@/types/http-response";

const INSTANCE_PATH = "/api/eco-replies/{id:uuid}/votes";

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

    const ecoReplyId = parsedSearchParamsResult.data.id;
    const authed = req.auth;

    if (!authed) {
        try {
            const [votes] = await db
                .select({
                    ecoReplyId: ecoReplies.id,
                    upvotes: ecoReplies.upvotes,
                    downvotes: ecoReplies.downvotes,
                })
                .from(ecoReplies)
                .where(eq(ecoReplies.id, ecoReplyId));

            if (!votes) {
                return httpErrorResponse({
                    type: "about:blank",
                    title: "Not Found",
                    status: 404,
                    detail: `Eco reply with id "${ecoReplyId}" was not found.`,
                    errors: {
                        code: 123,
                        details: `Eco reply with id "${ecoReplyId}" was not found.`,
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
                .from(ecoReplyVotes)
                .where(
                    and(
                        eq(ecoReplyVotes.ecoReplyId, ecoReplyId),
                        eq(ecoReplyVotes.userId, authed.user.id)
                    )
                );

            const [voteCount] = await tx
                .select({
                    id: ecoReplies.id,
                    upvotes: ecoReplies.upvotes,
                    downvotes: ecoReplies.downvotes,
                })
                .from(ecoReplies)
                .where(
                    and(
                        eq(ecoReplies.id, ecoReplyId),
                        eq(ecoReplies.userId, authed.user.id)
                    )
                );

            return {
                vote: {
                    status: existingVote ? true : false,
                    voteType: existingVote ? existingVote.voteType : null,
                },
                count: {
                    ecoReplyId: voteCount.id,
                    upvotes: voteCount.upvotes,
                    downvotes: voteCount.downvotes,
                },
            };
        });
        if (!result.count) {
            return httpErrorResponse({
                type: "about:blank",
                title: "Not Found",
                status: 404,
                detail: `Eco reply with id "${ecoReplyId}" was not found.`,
                errors: {
                    code: 123,
                    details: `Eco reply with id "${ecoReplyId}" was not found.`,
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

    const ecoReplyId = parsedSearchParamsResult.data.id;
    const userId = req.auth.user.id;
    const { upvote } = parsedBodyResult.data;

    if (upvote) {
        try {
            const result = await db.transaction(async (tx) => {
                return await handleEcoReplyVote({
                    tx,
                    id: ecoReplyId,
                    userId,
                    voteType: "up",
                });
            });

            return httpSuccessResponse({
                action: result.action as ApiAction,
                status: (result.action as ApiAction) === "created" ? 201 : 200,
                instance: INSTANCE_PATH,
                data: {
                    vote: result.vote,
                    count: result.count,
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
                return await handleEcoReplyVote({
                    tx,
                    id: ecoReplyId,
                    userId,
                    voteType: "down",
                });
            });

            return httpSuccessResponse({
                action: result.action as ApiAction,
                status: (result.action as ApiAction) === "created" ? 201 : 200,
                instance: INSTANCE_PATH,
                data: {
                    vote: result.vote,
                    count: result.count,
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
