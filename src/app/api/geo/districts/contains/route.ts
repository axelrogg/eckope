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

    const rawQuery = {
        latitude: searchParams.get("latitude"),
        longitude: searchParams.get("longitude"),
        format: searchParams.get("format") || undefined,
    };

    console.log("[GeoAPI_Districts_Contains_GET] Incoming request with query:", rawQuery);

    const parseResult = pointInDistrictQuerySchema.safeParse(rawQuery);

    if (!parseResult.success) {
        console.error(
            "[GeoAPI_Districts_Contains_GET] Query validation failed:",
            z.treeifyError(parseResult.error)
        );
        return httpErrorResponse({
            type: "about:blank",
            title: "Invalid query parameters",
            status: 400,
            detail: "One or more parameters are invalid.",
            errors: {
                code: 123, // TODO: Implement API error codes
                ...z.treeifyError(parseResult.error),
            },
            instance: req.nextUrl.pathname,
        });
    }

    const { latitude, longitude, format } = parseResult.data;

    console.log("[GeoAPI_Districts_Contains_GET] Fetching district containing point:", {
        latitude,
        longitude,
    });

    const district = await geoQueries
        .districts()
        .containsPoint({
            lat: latitude,
            lng: longitude,
        })
        .findOne();

    if (!district) {
        console.log(
            "[GeoAPI_Districts_Contains_GET] No district found containing point."
        );
        return NextResponse.json(null, { status: 200 });
    }

    console.log("[GeoAPI_Districts_Contains_GET] District found:", {
        id: district.id,
        name: district.name,
        ubigeo: district.ubigeo,
    });

    if (format === "geojson") {
        console.log(
            "[GeoAPI_Districts_Contains_GET] Returning response in GeoJSON format"
        );
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

    console.log("[GeoAPI_Districts_Contains_GET] Returning response in JSON format");

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
