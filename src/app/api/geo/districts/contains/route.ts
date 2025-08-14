import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/lib/database/db";
import { peruDepartments, peruDistricts, peruProvinces } from "@root/drizzle/schema";
import { districtContainsPointRequestQuerySchema } from "@/lib/schemas/geo/district-contains-point";
import { httpErrorResponse } from "@/lib/http/response";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const rawQuery = {
        lat: Number(searchParams.get("lat")),
        lng: Number(searchParams.get("lng")),
    };

    const parseResult = districtContainsPointRequestQuerySchema.safeParse(rawQuery);

    if (!parseResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                details: z.treeifyError(parseResult.error).properties,
            },
            instance: req.nextUrl.pathname,
        });
    }

    const { lat, lng } = parseResult.data;

    try {
        const [district] = await db
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
            })
            .from(peruDistricts)
            .where(
                sql`ST_Intersects(
                ${peruDistricts.geometry},
                    ST_SetSRID(ST_Point(${lat}, ${lng}), 4326)
            )`
            )
            .innerJoin(
                peruDepartments,
                eq(peruDistricts.departmentId, peruDepartments.id)
            )
            .innerJoin(peruProvinces, eq(peruDistricts.provinceId, peruProvinces.id))
            .limit(1);

        if (!district) {
            return NextResponse.json(null);
        }

        return NextResponse.json({
            id: district.id,
            ubigeo: district.ubigeo,
            name: district.name,
            department: district.department,
            province: district.province,
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
