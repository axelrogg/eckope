import L from "leaflet";
import { point, booleanPointInPolygon } from "@turf/turf";
import type { Feature, Polygon, MultiPolygon, GeometryCollection } from "geojson";

function isPointInFeature(latlng: L.LatLng, feature: Feature): boolean {
    const pt = point([latlng.lng, latlng.lat]);

    const { geometry } = feature;

    if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
        return booleanPointInPolygon(pt, feature as Feature<Polygon | MultiPolygon>);
    }

    if (geometry.type === "GeometryCollection") {
        const geometries = (geometry as GeometryCollection).geometries;

        return geometries.some((geom) => {
            if (geom.type === "Polygon" || geom.type === "MultiPolygon") {
                const tempFeature: Feature<Polygon | MultiPolygon> = {
                    type: "Feature",
                    geometry: geom as Polygon | MultiPolygon,
                    properties: {},
                };
                return booleanPointInPolygon(pt, tempFeature);
            }
            return false;
        });
    }

    return false;
}

export function getContainingFeature(
    latlng: L.LatLng,
    geoJson: GeoJSON.FeatureCollection
): Feature | null {
    return geoJson.features.find((feature) => isPointInFeature(latlng, feature)) || null;
}
