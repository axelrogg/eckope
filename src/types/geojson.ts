export type Position = [number, number];

export type Point = {
    type: "Point";
    coordinates: Position;
};

export type MultiPoint = {
    type: "MultiPoint";
    coordinates: Position[];
};

export type LineString = {
    type: "LineString";
    coordinates: Position[];
};

export type MultiLineString = {
    type: "MultiLineString";
    coordinates: Position[][];
};

export type Polygon = {
    type: "Polygon";
    coordinates: Position[][];
};

export type MultiPolygon = {
    type: "MultiPolygon";
    coordinates: Position[][][];
};

export type GeoJSONGeometry =
    | Point
    | MultiPoint
    | LineString
    | MultiLineString
    | Polygon
    | MultiPolygon;

export type GeoJSONEntity<T extends Record<string, unknown>> = {
    geometry: GeoJSONGeometry;
    properties: T;
};
