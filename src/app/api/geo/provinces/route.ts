import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { geoQueries } from "@/lib/database/queries/geo";
import { httpErrorResponse } from "@/lib/http/error-response";
import { toGeoJSON } from "@/lib/utils/to-geojson";

const provinceQuerySchema = z.object({
    code: z
        .string()
        .trim()
        .refine((val) => val.length === 4 && !isNaN(Number(val)), {
            message: "Each 'code' must be a 4-digit numeric string",
        })
        .optional(),
    name: z.string().trim().optional(),
    departmentCode: z
        .string()
        .trim()
        .refine((val) => val.length === 2 && !isNaN(Number(val)), {
            message: "Each 'code' must be a 2-digit numeric string",
        })
        .optional(),
    departmentName: z.string().trim().optional(),
    format: z
        .string()
        .trim()
        .toLowerCase()
        .transform((val) => val || "json")
        .refine((val) => ["json", "geojson"].includes(val), {
            message: "Format must be either 'json' or 'geojson'",
        })
        .optional(),
});

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const rawQuery = {
        code: searchParams.get("code") || undefined,
        name: searchParams.get("name") || undefined,
        departmentCode: searchParams.get("department_code") || undefined,
        departmentName: searchParams.get("department_name") || undefined,
        format: searchParams.get("format") || undefined,
    };

    console.log("[GeoAPI_Provinces_GET] Incoming request with query:", rawQuery);

    const queryParseResult = provinceQuerySchema.safeParse(rawQuery);

    if (!queryParseResult.success) {
        console.error(
            "[GeoAPI_Provinces_GET] Query validation failed:",
            z.treeifyError(queryParseResult.error)
        );
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more query parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(queryParseResult.error),
            },
            instance: req.nextUrl.pathname,
        });
    }

    const { code, name, departmentCode, departmentName, format } = queryParseResult.data;

    console.log("[GeoAPI_Provinces_GET] Fetching provinces with filters:", {
        code,
        name,
        departmentCode,
        departmentName,
    });

    const provinces = await geoQueries
        .provinces()
        .where({
            params: {
                code,
                name,
                department: {
                    code: departmentCode,
                    name: departmentName,
                },
            },
        })
        .findMany();

    console.log(`[GeoAPI_Provinces_GET] ${provinces.length} provinces found`);

    if (!provinces || provinces.length === 0) {
        console.log("[GeoAPI_Provinces_GET] No matching provinces found.");
        return NextResponse.json([], { status: 200 });
    }

    if (format === "geojson") {
        console.log("[GeoAPI_Provinces_GET] Returning response in GeoJSON format");
        return NextResponse.json(
            toGeoJSON(
                provinces.map((prov) => ({
                    properties: {
                        id: prov.id,
                        code: prov.code,
                        name: prov.name,
                        length_deg: prov.lengthDeg,
                        area_deg2: prov.areaDeg2,
                        length_km: prov.lengthKm,
                        area_km2: prov.areaKm2,
                        deparment: {
                            id: prov.department.id,
                            code: prov.department.code,
                            name: prov.department.name,
                        },
                    },
                    geometry: prov.geometry,
                }))
            )
        );
    }

    console.log("[GeoAPI_Provinces_GET] Returning response in JSON format");

    return NextResponse.json(
        provinces.map((prov) => ({
            id: prov.id,
            code: prov.code,
            name: prov.name,
            length_deg: prov.lengthDeg,
            area_deg2: prov.areaDeg2,
            length_km: prov.lengthKm,
            area_km2: prov.areaKm2,
            deparment: {
                id: prov.department.id,
                code: prov.department.code,
                name: prov.department.name,
            },
        }))
    );
}
