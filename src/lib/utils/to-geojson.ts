import { GeoJSONEntity } from "@/types/geojson";

export function toGeoJSON<T extends Record<string, unknown>>(
    input: GeoJSONEntity<T> | GeoJSONEntity<T>[]
) {
    const entities = Array.isArray(input) ? input : [input];

    return {
        type: "FeatureCollection" as const,
        features: entities.map((item) => ({
            type: "Feature" as const,
            properties: item.properties,
            geometry: item.geometry,
        })),
    };
}
