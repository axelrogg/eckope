import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { geoQueries } from "@/lib/database/queries/geo";
import { httpErrorResponse } from "@/lib/http/error-response";
import { toGeoJSON } from "@/lib/utils/to-geojson";

const provinceQuerySchema = z.object({
    codes: z
        .array(
            z
                .string()
                .trim()
                .refine((val) => val.length === 4 && !isNaN(Number(val)), {
                    message: "Each 'code' must be a 4-digit numeric string",
                })
        )
        .optional(),
    names: z.array(z.string().trim()).optional(),
    departmentCodes: z
        .array(
            z
                .string()
                .trim()
                .refine((val) => val.length === 2 && !isNaN(Number(val)), {
                    message: "Each 'code' must be a 2-digit numeric string",
                })
        )
        .optional(),
    departmentNames: z.array(z.string().trim()).optional(),
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
    const queryParseResult = provinceQuerySchema.safeParse({
        codes: searchParams.getAll("code") || undefined,
        names: searchParams.getAll("name") || undefined,
        departmentCodes: searchParams.getAll("department_code") || undefined,
        departmentNames: searchParams.getAll("department_name") || undefined,
        format: searchParams.get("format") || undefined,
    });

    if (!queryParseResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more query parameters are invalid.",
            errors: z.treeifyError(queryParseResult.error),
            instance: req.nextUrl.pathname,
        });
    }

    const { codes, names, departmentCodes, departmentNames, format } =
        queryParseResult.data;

    const provinces = await geoQueries.provinces.findMany({
        codes,
        names,
        departmentCodes,
        departmentNames,
    });
    if (!provinces) return NextResponse.json([], { status: 200 });

    if (format === "geojson") {
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
