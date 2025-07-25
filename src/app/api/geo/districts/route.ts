import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { httpErrorResponse } from "@/lib/http/error-response";
import { geoQueries } from "@/lib/database/queries/geo";
import { toGeoJSON } from "@/lib/utils/to-geojson";

const querySchema = z.object({
    ubigeo: z
        .string()
        .trim()
        .refine((val) => val.length === 6 && !isNaN(Number(val)), {
            message: "Each 'ubigeo' must be a 6-digit numeric string",
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
    provinceCode: z
        .string()
        .trim()
        .refine((val) => val.length === 4 && !isNaN(Number(val)), {
            message: "Each 'code' must be a 4-digit numeric string",
        })
        .optional(),
    provinceName: z.string().trim().optional(),
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
        ubigeo: searchParams.get("ubigeo") || undefined,
        name: searchParams.get("name") || undefined,
        departmentCode: searchParams.get("department_code") || undefined,
        departmentName: searchParams.get("department_name") || undefined,
        provinceCode: searchParams.get("province_code") || undefined,
        provinceName: searchParams.get("province_name") || undefined,
        format: searchParams.get("format") || undefined,
    };

    console.log("[GeoAPI_Districts_GET] Incoming request with query:", rawQuery);

    const parseResult = querySchema.safeParse(rawQuery);

    if (!parseResult.success) {
        console.error(
            "[GeoAPI_Districts_GET] Query validation failed:",
            z.treeifyError(parseResult.error)
        );
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

    console.log("[GeoAPI_Districts_GET] Fetching districts with filters:", {
        ubigeo,
        name,
        departmentCode,
        departmentName,
        provinceCode,
        provinceName,
    });

    const districtsFound = await geoQueries
        .districts()
        .where({
            params: {
                ubigeo,
                name,
                departmentCode,
                departmentName,
                provinceCode,
                provinceName,
            },
        })
        .findMany();

    console.log(`[GeoAPI_Districts_GET] ${districtsFound.length} districts found`);

    if (!districtsFound || districtsFound.length === 0) {
        console.log("[GeoAPI_Districts_GET] No matching districts found.");
        return NextResponse.json([], { status: 200 });
    }

    if (format === "geojson") {
        console.log("[GeoAPI_Districts_GET] Returning response in GeoJSON format");
        return NextResponse.json(
            toGeoJSON(
                districtsFound.map((dist) => ({
                    properties: {
                        id: dist.id,
                        ubigeo: dist.ubigeo,
                        name: dist.name,
                        length_deg: dist.lengthDeg,
                        area_deg2: dist.areaDeg2,
                        length_km: dist.lengthKm,
                        area_km2: dist.areaKm2,
                        department: {
                            ...dist.department,
                        },
                        province: {
                            ...dist.province,
                        },
                    },
                    geometry: dist.geometry,
                }))
            )
        );
    }

    console.log("[GeoAPI_Districts_GET] Returning response in JSON format");

    return NextResponse.json(
        districtsFound.map((dist) => ({
            id: dist.id,
            ubigeo: dist.ubigeo,
            name: dist.name,
            length_deg: dist.lengthDeg,
            area_deg2: dist.areaDeg2,
            length_km: dist.lengthKm,
            area_km2: dist.areaKm2,
            department: {
                ...dist.department,
            },
            province: {
                ...dist.province,
            },
        }))
    );
}
