import { NextRequest } from "next/server";

import db from "@/lib/database/db";
import { ecoPins as ecoPinsTable } from "@root/drizzle/schema";
import { projectSQLGeometry } from "@/lib/utils/project-geometry";
import { httpErrorResponse, httpSuccessResponse } from "@/lib/http/response";

const INSTANCE_PATH = "/api/map/eco-pins";

export async function GET(req: NextRequest) {
    try {
        const ecoPins = await db
            .select({
                id: ecoPinsTable.id,
                location: projectSQLGeometry(ecoPinsTable.location),
                createdAt: ecoPinsTable.createdAt,
                updatedAt: ecoPinsTable.updatedAt,
                severity: ecoPinsTable.severity,
            })
            .from(ecoPinsTable);

        return httpSuccessResponse({
            action: "fetched",
            instance: INSTANCE_PATH,
            data: ecoPins,
        });
    } catch (error) {
        return httpErrorResponse({
            status: 500,
            title: "Internal Server Error",
            detail: "An unexpected error occurred while fetching the department",
            type: "about:blank",
            instance: req.nextUrl.pathname,
            errors: {
                code: 123,
                message: error instanceof Error ? error.message : String(error),
            },
        });
    }
}
