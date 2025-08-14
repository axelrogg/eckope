import { NextRequest } from "next/server";
import { NextAuthRequest } from "next-auth";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";
import z from "zod";

import db from "@/lib/database/db";
import { ecoPins as ecoPinsTable, usersInNextAuth } from "@root/drizzle/schema";
import { idRequestSearchParamSchema } from "@/lib/schemas/geo/constants";
import { projectSQLGeometry } from "@/lib/utils/project-geometry";
import { ecoPinUpdateSchema } from "@/lib/schemas/eco-pin-update";
import { httpErrorResponse, httpSuccessResponse } from "@/lib/http/response";
import { parseApiRequestBody } from "@/lib/utils/api/parse-api-request-body";

const INSTANCE_PATH = "/api/eco-pins/{id:uuid}";

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

    const ecoPinId = parsedSearchParamsResult.data.id;
    try {
        const [ecoPin] = await db
            .select({
                id: ecoPinsTable.id,
                title: ecoPinsTable.title,
                content: ecoPinsTable.content,
                category: ecoPinsTable.category,
                custom_category: ecoPinsTable.customCategory,
                severity: ecoPinsTable.severity,
                upvotes: ecoPinsTable.upvotes,
                downvotes: ecoPinsTable.downvotes,
                edited: ecoPinsTable.edited,
                location: projectSQLGeometry(ecoPinsTable.location),
                created_at: ecoPinsTable.createdAt,
                updated_at: ecoPinsTable.updatedAt,
                author: {
                    id: ecoPinsTable.userId,
                    email: usersInNextAuth.email,
                    name: usersInNextAuth.name,
                    image: usersInNextAuth.image,
                },
            })
            .from(ecoPinsTable)
            .where(eq(ecoPinsTable.id, ecoPinId))
            .innerJoin(usersInNextAuth, eq(ecoPinsTable.userId, usersInNextAuth.id));

        return httpSuccessResponse({
            action: "fetched",
            instance: INSTANCE_PATH,
            data: ecoPin,
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

export const PATCH = auth(async function PATCH(
    req: NextAuthRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const instancePath = req.nextUrl.pathname.split("/").slice(0, -1).join("/");

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
            instance: instancePath,
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
            instance: instancePath,
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

    const parseBodyResult = ecoPinUpdateSchema.safeParse(reqBodyData);
    if (!parseBodyResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid request body",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(parseBodyResult.error),
            },
            instance: instancePath,
        });
    }

    const { title, content } = parseBodyResult.data;
    const ecoPinId = parsedSearchParamsResult.data.id;
    const userId = req.auth.user.id;

    const updateData: Partial<typeof ecoPinsTable.$inferInsert> = {};
    updateData.title = title;
    updateData.content = content;

    try {
        const [result] = await db
            .update(ecoPinsTable)
            .set({
                edited: true,
                ...updateData,
            })
            .where(and(eq(ecoPinsTable.id, ecoPinId), eq(ecoPinsTable.userId, userId)))
            .returning();

        return httpSuccessResponse({
            action: "updated",
            instance: INSTANCE_PATH,
            data: result,
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
            instance: instancePath,
        });
    }
});
