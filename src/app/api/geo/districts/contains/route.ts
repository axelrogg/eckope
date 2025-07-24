import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { geoQueries } from "@/lib/database/queries/geo";
import { httpErrorResponse } from "@/lib/http/error-response";
import { toGeoJSON } from "@/lib/utils/to-geojson";

const pointInDistrictQuerySchema = z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
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

    const parseResult = pointInDistrictQuerySchema.safeParse({
        latitude: searchParams.get("latitude"),
        longitude: searchParams.get("longitude"),
        format: searchParams.get("format") || undefined,
    });

    if (!parseResult.success) {
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123,
                ...z.treeifyError(parseResult.error),
            },
            instance: req.nextUrl.pathname,
        });
    }

    const { latitude, longitude, format } = parseResult.data;

    const district = await geoQueries.districts.contains({
        lat: latitude,
        lng: longitude,
    });

    if (!district) {
        return NextResponse.json(null, { status: 200 });
    }

    if (format === "geojson") {
        return NextResponse.json(
            toGeoJSON({
                properties: {
                    ubigeo: district.ubigeo,
                    name: district.name,
                    department: {
                        ...district.department,
                    },
                    province: {
                        ...district.province,
                    },
                },
                geometry: district.geometry,
            })
        );
    }

    return NextResponse.json({
        ubigeo: district.ubigeo,
        name: district.name,
        department: {
            ...district.department,
        },
        province: {
            ...district.province,
        },
    });
}
