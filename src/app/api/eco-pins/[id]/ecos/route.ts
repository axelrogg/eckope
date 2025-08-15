import { NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";
import z from "zod";

import db from "@/lib/database/db";
import { ecoReplies, ecos as ecosTable, usersInNextAuth } from "@root/drizzle/schema";
import { httpErrorResponse, httpSuccessResponse } from "@/lib/http/response";
import { idRequestSearchParamSchema } from "@/lib/schemas/geo/constants";

const INSTANCE_PATH = "/api/eco-pins/{id:uuid}/ecos";

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
                details: {
                    ...z.treeifyError(parsedSearchParamsResult.error).properties,
                },
            },
            instance: INSTANCE_PATH,
        });
    }

    const ecoPinId = parsedSearchParamsResult.data.id;
    try {
        const ecos = await db
            .select({
                id: ecosTable.id,
                ecoPinId: ecosTable.ecoPinId,
                content: ecosTable.content,
                edited: ecosTable.edited,
                upvotes: ecosTable.upvotes,
                downvotes: ecosTable.downvotes,
                createdAt: ecosTable.createdAt,
                updatedAt: ecosTable.updatedAt,
                replyCount: db.$count(ecoReplies, eq(ecoReplies.ecoId, ecosTable.id)),
                author: {
                    id: usersInNextAuth.id,
                    email: usersInNextAuth.email,
                    name: usersInNextAuth.name,
                    image: usersInNextAuth.image,
                },
            })
            .from(ecosTable)
            .where(eq(ecosTable.ecoPinId, ecoPinId))
            .innerJoin(usersInNextAuth, eq(ecosTable.userId, usersInNextAuth.id))
            .orderBy(desc(ecosTable.updatedAt));

        return httpSuccessResponse({
            instance: INSTANCE_PATH,
            action: "fetched",
            data: ecos,
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
