import { Geometry } from "geojson";

export type FilterLogic = "and" | "or";

export type WhereClauseParams<T> = {
    logic?: FilterLogic;
    params: T;
};

export type PeruDepartment = {
    id: string;
    code: string;
    name: string;
    lengthDeg: number;
    areaDeg2: number;
    lengthKm: number;
    areaKm2: number;
    geometry: Geometry;
};

export type PeruProvince = {
    id: string;
    code: string;
    name: string;

    lengthDeg: number;
    areaDeg2: number;
    lengthKm: number;
    areaKm2: number;
    department: {
        id: string;
        code: string;
        name: string;
    };
    geometry: Geometry;
};

export type PeruDistrict = {
    id: string;
    ubigeo: string;
    name: string;

    lengthDeg: number;
    areaDeg2: number;
    lengthKm: number;
    areaKm2: number;
    department: {
        id: string;
        code: string;
        name: string;
    };
    province: {
        id: string;
        code: string;
        name: string;
    };
    geometry: Geometry;
};
