import { NextRequest } from "next/server";
import { sql } from "drizzle-orm";
import z from "zod";

import db from "@/lib/database/db";
import { newEcoPinFormSchema } from "@/lib/schemas/new-eco-pin";
import { ecoPins } from "@root/drizzle/schema";
import { httpErrorResponse, httpSuccessResponse } from "@/lib/http/response";
import { parseApiRequestBody } from "@/lib/utils/api/parse-api-request-body";

const INSTANCE_PATH = "/api/eco-pins";

export async function POST(req: NextRequest) {
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

    const queryParsedResult = newEcoPinFormSchema.safeParse(reqBodyData);
    if (!queryParsedResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(queryParsedResult.error),
            },
            instance: req.nextUrl.pathname,
        });
    }

    const data = queryParsedResult.data;

    try {
        const [result] = await db
            .insert(ecoPins)
            .values({
                title: data.title,
                content: data.content,
                severity: data.severity,
                customCategory: data.customCategory,
                category: data.category,
                location: sql`ST_SetSRID(ST_MakePoint(${data.location.lng}, ${data.location.lat}), 4326)`,
                userId: data.userId,
            })
            .returning({
                id: ecoPins.id,
            });

        return httpSuccessResponse({
            status: 201,
            action: "created",
            instance: INSTANCE_PATH,
            data: result,
        });
    } catch (error) {
        return httpErrorResponse({
            status: 500,
            title: "Internal Server Error",
            detail: "An unexpected error occurred while creating the eco.",
            type: "about:blank",
            instance: req.nextUrl.pathname,
            errors: {
                code: 123,
                message: error instanceof Error ? error.message : String(error),
            },
        });
    }
}
