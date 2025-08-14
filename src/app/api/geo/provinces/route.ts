import { NextRequest, NextResponse } from "next/server";
import { and, eq, ilike, SQL } from "drizzle-orm";
import z from "zod";

import db from "@/lib/database/db";
import { peruDepartments, peruProvinces } from "@root/drizzle/schema";
import { toGeoJSON } from "@/lib/utils/to-geojson";
import { provinceRequestQuerySchema } from "@/lib/schemas/geo/province";
import { projectSQLGeometry } from "@/lib/utils/project-geometry";
import { httpErrorResponse } from "@/lib/http/response";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const parsedRequestSearchParams = provinceRequestQuerySchema.safeParse({
        code: searchParams.get("code") || undefined,
        name: searchParams.get("name") || undefined,
        departmentCode: searchParams.get("department_code") || undefined,
        departmentName: searchParams.get("department_name") || undefined,
        format: searchParams.get("format") || undefined,
    });

    if (!parsedRequestSearchParams.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more query parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(parsedRequestSearchParams.error),
            },
            instance: req.nextUrl.pathname,
        });
    }

    const { code, name, departmentCode, departmentName, format } =
        parsedRequestSearchParams.data;
    const filters: SQL[] = [];
    if (code) {
        filters.push(eq(peruProvinces.code, code));
    }
    if (name) {
        filters.push(ilike(peruProvinces.name, name));
    }
    if (departmentCode) {
        filters.push(eq(peruDepartments.code, departmentCode));
    }
    if (departmentName) {
        filters.push(eq(peruDepartments.name, departmentName));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    try {
        const provinces = await db
            .select({
                id: peruProvinces.id,
                code: peruProvinces.code,
                name: peruProvinces.name,
                department: {
                    id: peruDepartments.id,
                    code: peruDepartments.code,
                    name: peruDepartments.name,
                },
                lengthDeg: peruProvinces.lengthDeg,
                areaDeg2: peruProvinces.areaDeg2,
                lengthKm: peruProvinces.lengthKm,
                areaKm2: peruProvinces.areaKm2,
                geometry: projectSQLGeometry(peruProvinces.geometry),
            })
            .from(peruProvinces)
            .where(whereClause)
            .innerJoin(
                peruDepartments,
                eq(peruProvinces.departmentId, peruDepartments.id)
            );
        if (format === "geojson") {
            return NextResponse.json(
                toGeoJSON(
                    provinces.map((prov) => ({
                        properties: {
                            id: prov.id,
                            code: prov.code,
                            name: prov.name,
                            lengthDeg: prov.lengthDeg,
                            areaDeg2: prov.areaDeg2,
                            lengthKm: prov.lengthKm,
                            areaKm2: prov.areaKm2,
                            deparment: prov.department,
                        },
                        geometry: prov.geometry,
                    }))
                )
            );
        }
        return NextResponse.json(provinces);
    } catch (error) {
        return httpErrorResponse({
            status: 500,
            title: "Internal Server Error",
            detail: "An unexpected error occurred while fetching the provinces",
            type: "about:blank",
            instance: req.nextUrl.pathname,
            errors: {
                code: 123,
                message: error instanceof Error ? error.message : String(error),
            },
        });
    }
}
