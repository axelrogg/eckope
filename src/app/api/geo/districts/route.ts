import { NextRequest, NextResponse } from "next/server";
import { and, eq, ilike, SQL } from "drizzle-orm";
import z from "zod";

import db from "@/lib/database/db";
import { peruDepartments, peruDistricts, peruProvinces } from "@root/drizzle/schema";
import { toGeoJSON } from "@/lib/utils/to-geojson";
import { districtRequestQuerySchema } from "@/lib/schemas/geo/district";
import { projectSQLGeometry } from "@/lib/utils/project-geometry";
import { httpErrorResponse } from "@/lib/http/response";
import { Geometry } from "geojson";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const rawSearchParams = {
        ubigeo: searchParams.get("ubigeo") || undefined,
        name: searchParams.get("name") || undefined,
        departmentCode: searchParams.get("department_code") || undefined,
        departmentName: searchParams.get("department_name") || undefined,
        provinceCode: searchParams.get("province_code") || undefined,
        provinceName: searchParams.get("province_name") || undefined,
        format: searchParams.get("format") || undefined,
    };

    const parseResult = districtRequestQuerySchema.safeParse(rawSearchParams);

    if (!parseResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more query parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(parseResult.error),
            },
            instance: req.nextUrl.pathname,
        });
    }

    const {
        ubigeo,
        name,
        departmentCode,
        departmentName,
        provinceCode,
        provinceName,
        format,
    } = parseResult.data;
    const filters: SQL[] = [];

    if (ubigeo) {
        filters.push(eq(peruDistricts.ubigeo, ubigeo));
    }

    if (name) {
        filters.push(ilike(peruDistricts.name, name));
    }

    if (departmentCode) {
        filters.push(eq(peruDepartments.code, departmentCode));
    }

    if (departmentName) {
        filters.push(ilike(peruDepartments.name, departmentName));
    }

    if (provinceCode) {
        filters.push(eq(peruProvinces.code, provinceCode));
    }

    if (provinceName) {
        filters.push(ilike(peruProvinces.name, provinceName));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    try {
        const districts = await db
            .select({
                id: peruDistricts.id,
                name: peruDistricts.name,
                ubigeo: peruDistricts.ubigeo,
                department: {
                    id: peruDepartments.id,
                    code: peruDepartments.code,
                    name: peruDepartments.name,
                },
                province: {
                    id: peruProvinces.id,
                    code: peruProvinces.code,
                    name: peruProvinces.name,
                },
                lengthDeg: peruDistricts.lengthDeg,
                areaDeg2: peruDistricts.areaDeg2,
                lengthKm: peruDistricts.lengthKm,
                areaKm2: peruDistricts.areaKm2,
                geometry: projectSQLGeometry(peruDistricts.geometry),
            })
            .from(peruDistricts)
            .where(whereClause)
            .innerJoin(
                peruDepartments,
                eq(peruDistricts.departmentId, peruDepartments.id)
            )
            .innerJoin(peruProvinces, eq(peruDistricts.provinceId, peruProvinces.id));

        if (format === "geojson") {
            return NextResponse.json(
                toGeoJSON(
                    districts.map((dist) => ({
                        properties: {
                            id: dist.id,
                            ubigeo: dist.ubigeo,
                            name: dist.name,
                            department: dist.department,
                            province: dist.province,
                            lengthDeg: dist.lengthDeg,
                            areaDeg2: dist.areaDeg2,
                            lengthKm: dist.lengthKm,
                            areaKm2: dist.areaKm2,
                        },
                        geometry: dist.geometry as Geometry,
                    }))
                )
            );
        }
        return NextResponse.json(districts);
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
