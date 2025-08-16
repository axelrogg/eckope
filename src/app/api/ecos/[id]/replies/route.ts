import db from "@/lib/database/db";
import { httpErrorResponse, httpSuccessResponse } from "@/lib/http/response";
import { idRequestSearchParamSchema } from "@/lib/schemas/geo/constants";
import { ecoReplies, usersInNextAuth } from "@root/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import z from "zod";

const INSTANCE_PATH = "/api/ecos/{id:uuid}/replies";

export async function GET(
    _req: NextRequest,
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
                details: z.treeifyError(parsedSearchParamsResult.error),
            },
            instance: INSTANCE_PATH,
        });
    }

    const ecoId = parsedSearchParamsResult.data.id;

    try {
        const replies = await db
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
            .where(eq(ecoReplies.ecoId, ecoId))
            .innerJoin(usersInNextAuth, eq(ecoReplies.userId, usersInNextAuth.id))
            .orderBy(desc(ecoReplies.updatedAt));
        return httpSuccessResponse({
            action: "fetched",
            instance: INSTANCE_PATH,
            data: replies,
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
