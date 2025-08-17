import { NextRequest, NextResponse } from "next/server";
import { and, eq, SQL } from "drizzle-orm";
import z from "zod";

import db from "@/lib/database/db";
import { peruDepartments } from "@root/drizzle/schema";
import { toGeoJSON } from "@/lib/utils/to-geojson";
import { projectSQLGeometry } from "@/lib/utils/project-geometry";
import { departmentRequestQuerySchema } from "@/lib/schemas/geo/department";
import { httpErrorResponse } from "@/lib/http/response";
import { Geometry } from "geojson";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const parsedSearchParamsResult = departmentRequestQuerySchema.safeParse({
        name: searchParams.get("name") || undefined,
        code: searchParams.get("code") || undefined,
        format: searchParams.get("format") || undefined,
    });

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
            instance: req.nextUrl.pathname,
        });
    }

    const { code, name, format } = parsedSearchParamsResult.data;
    const filters: SQL[] = [];

    if (code) {
        filters.push(eq(peruDepartments.code, code));
    }
    if (name) {
        filters.push(eq(peruDepartments.name, name));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    try {
        const departments = await db
            .select({
                id: peruDepartments.id,
                code: peruDepartments.code,
                name: peruDepartments.name,
                lengthDeg: peruDepartments.lengthDeg,
                areaDeg2: peruDepartments.areaDeg2,
                lengthKm: peruDepartments.lengthKm,
                areaKm2: peruDepartments.areaKm2,
                geometry: projectSQLGeometry(peruDepartments.geometry),
            })
            .from(peruDepartments)
            .where(whereClause);

        if (format === "geojson") {
            return NextResponse.json(
                toGeoJSON(
                    departments.map((dep) => ({
                        properties: {
                            id: dep.id,
                            code: dep.code,
                            name: dep.name,
                            lengthDeg: dep.lengthDeg,
                            areaDeg2: dep.areaDeg2,
                            lengthKm: dep.lengthKm,
                            areaKm2: dep.areaKm2,
                        },
                        geometry: dep.geometry as Geometry,
                    }))
                )
            );
        }
        return NextResponse.json(departments);
    } catch (error) {
        console.error(error);
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
