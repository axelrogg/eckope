import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { httpErrorResponse } from "@/lib/http/error-response";
import { geoQueries } from "@/lib/database/queries/geo";
import { toGeoJSON } from "@/lib/utils/to-geojson";

const departmentQuerySchema = z.object({
    code: z
        .string()
        .trim()
        .refine((val) => val.length === 2 && !isNaN(Number(val)), {
            message: "Each 'ubigeo' must be a 2-digit numeric string",
        })
        .optional(),
    name: z.string().trim().optional(),
    format: z
        .string()
        .trim()
        .toLowerCase()
        .transform((val) => val || "json")
        .refine((val) => !val || ["json", "geojson"].includes(val), {
            message: "Format must be either 'json' or 'geojson'",
        })
        .optional(),
});

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const queryParseResult = departmentQuerySchema.safeParse({
        code: searchParams.get("code") || undefined,
        name: searchParams.get("name") || undefined,
        format: searchParams.get("format") || undefined,
    });

    if (!queryParseResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(queryParseResult.error),
            },
            instance: req.nextUrl.pathname,
        });
    }

    const { code, name, format } = queryParseResult.data;

    const departmentsFound = await geoQueries
        .departments()
        .where({ params: { code, name } })
        .findMany();

    if (!departmentsFound) {
        return NextResponse.json([], { status: 200 });
    }

    if (format === "geojson") {
        return NextResponse.json(
            toGeoJSON(
                departmentsFound.map((dep) => ({
                    properties: {
                        id: dep.id,
                        code: dep.code,
                        name: dep.name,
                        length_deg: dep.lengthDeg,
                        area_deg2: dep.areaDeg2,
                        length_km: dep.lengthKm,
                        area_km2: dep.areaKm2,
                    },
                    geometry: dep.geometry,
                }))
            )
        );
    }

    return NextResponse.json(
        departmentsFound.map((dep) => ({
            id: dep.id,
            code: dep.code,
            name: dep.name,
            length_deg: dep.lengthDeg,
            area_deg2: dep.areaDeg2,
            length_km: dep.lengthKm,
            area_km2: dep.areaKm2,
        }))
    );
}
