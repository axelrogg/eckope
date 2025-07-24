import { and, eq, ilike, or, sql, SQL } from "drizzle-orm";
import { peruDepartments, peruDistricts, peruProvinces } from "@root/drizzle/schema";
import db from "@/lib/database/db";
import { GeoJSONGeometry } from "@/types/geojson";

type DepartmentProperties = {
    id: string;
    code: string;
    name: string;
    geometry: GeoJSONGeometry;
    lengthDeg: number;
    areaDeg2: number;
    lengthKm: number;
    areaKm2: number;
};

const departmentQueries = {
    async find({
        id,
        name,
        code,
    }: {
        id?: string;
        name?: string;
        code?: string;
    }): Promise<DepartmentProperties[] | null> {
        const filters: SQL[] = [];

        if (id) filters.push(ilike(peruDepartments.id, id));
        if (name) filters.push(ilike(peruDepartments.name, name));
        if (code) filters.push(ilike(peruDepartments.code, code));

        try {
            const departments = await db
                .select({
                    id: peruDepartments.id,
                    code: peruDepartments.code,
                    name: peruDepartments.name,
                    lengthDeg: peruDepartments.lengthDeg,
                    areaDeg2: peruDepartments.areaDeg2,
                    lengthKm: peruDepartments.lengthKm,
                    areaKm2: peruDepartments.areaKm2,
                    geometry: sql`ST_AsGeoJSON(${peruDepartments.geometry})::json`.as(
                        "geometry"
                    ),
                })
                .from(peruDepartments)
                .where(and(...filters));

            if (departments.length === 0) {
                return null;
            }

            return departments.map((dep) => ({
                id: dep.id,
                code: dep.code,
                name: dep.name,
                geometry: dep.geometry as GeoJSONGeometry,
                lengthDeg: dep.lengthDeg,
                areaDeg2: dep.areaDeg2,
                lengthKm: dep.lengthKm,
                areaKm2: dep.areaKm2,
            }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

type ProvinceProperties = {
    id: string;
    department: {
        id: string;
        code: string;
        name: string;
    };
    code: string;
    name: string;
    geometry: GeoJSONGeometry;
    lengthDeg: number;
    areaDeg2: number;
    lengthKm: number;
    areaKm2: number;
};

type DistrictProperties = {
    id: string;
    ubigeo: string;
    name: string;
    geometry: GeoJSONGeometry;
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
};
const provincesQueries = {
    async find({
        id,
        name,
        code,
        departmentId,
        departmentCode,
        departmentName,
    }: {
        id?: string;
        departmentId?: string;
        departmentCode?: string;
        departmentName?: string;
        name?: string;
        code?: string;
    }): Promise<ProvinceProperties[] | null> {
        const filters: SQL[] = [];

        if (id) filters.push(eq(peruProvinces.id, id));
        if (code) filters.push(eq(peruProvinces.code, code));
        if (name) filters.push(ilike(peruProvinces.name, name.toLowerCase()));
        if (departmentId) filters.push(eq(peruDepartments.id, departmentId));
        if (departmentCode) filters.push(eq(peruDepartments.code, departmentCode));
        if (departmentName)
            filters.push(ilike(peruDepartments.name, departmentName.toLowerCase()));

        const results = await db
            .select({
                id: peruProvinces.id,
                code: peruProvinces.code,
                name: peruProvinces.name,
                departmentId: peruDepartments.id,
                departmentCode: peruDepartments.code,
                departmentName: peruDepartments.name,
                lengthDeg: peruProvinces.lengthDeg,
                areaDeg2: peruProvinces.areaDeg2,
                lengthKm: peruProvinces.lengthKm,
                areaKm2: peruProvinces.areaKm2,
                geometry: sql`ST_AsGeoJSON(${peruProvinces.geometry})::json`.as(
                    "geometry"
                ),
            })
            .from(peruProvinces)
            .innerJoin(
                peruDepartments,
                eq(peruProvinces.departmentId, peruDepartments.id)
            )
            .where(and(...filters));

        if (results.length === 0) return null;

        return results.map((prov) => ({
            id: prov.id,
            code: prov.code,
            name: prov.name,
            geometry: prov.geometry as GeoJSONGeometry,
            lengthDeg: prov.lengthDeg,
            areaDeg2: prov.areaDeg2,
            lengthKm: prov.lengthKm,
            areaKm2: prov.areaKm2,
            department: {
                id: prov.departmentId,
                code: prov.departmentCode,
                name: prov.departmentName,
            },
        }));
    },
    async findMany({
        ids,
        names,
        codes,
        departmentIds,
        departmentCodes,
        departmentNames,
    }: {
        ids?: string[];
        departmentIds?: string[];
        departmentCodes?: string[];
        departmentNames?: string[];
        names?: string[];
        codes?: string[];
    }): Promise<ProvinceProperties[] | null> {
        const filters: SQL[] = [];

        if (ids) ids.forEach((id) => filters.push(eq(peruProvinces.id, id)));
        if (codes) codes.forEach((code) => filters.push(eq(peruProvinces.code, code)));
        if (names)
            names.forEach((name) =>
                filters.push(ilike(peruProvinces.name, name.toLowerCase()))
            );
        if (departmentIds)
            departmentIds.forEach((depId) => filters.push(eq(peruDepartments.id, depId)));
        if (departmentCodes)
            departmentCodes.forEach((depCode) =>
                filters.push(eq(peruDepartments.code, depCode))
            );
        if (departmentNames)
            departmentNames.forEach((depName) =>
                filters.push(ilike(peruDepartments.name, depName.toLowerCase()))
            );

        const results = await db
            .select({
                id: peruProvinces.id,
                code: peruProvinces.code,
                name: peruProvinces.name,
                departmentId: peruDepartments.id,
                departmentCode: peruDepartments.code,
                departmentName: peruDepartments.name,
                lengthDeg: peruProvinces.lengthDeg,
                areaDeg2: peruProvinces.areaDeg2,
                lengthKm: peruProvinces.lengthKm,
                areaKm2: peruProvinces.areaKm2,
                geometry: sql`ST_AsGeoJSON(${peruProvinces.geometry})::json`.as(
                    "geometry"
                ),
            })
            .from(peruProvinces)
            .innerJoin(
                peruDepartments,
                eq(peruProvinces.departmentId, peruDepartments.id)
            )
            .where(or(...filters));

        if (results.length === 0) return null;

        return results.map((prov) => ({
            id: prov.id,
            code: prov.code,
            name: prov.name,
            geometry: prov.geometry as GeoJSONGeometry,
            lengthDeg: prov.lengthDeg,
            areaDeg2: prov.areaDeg2,
            lengthKm: prov.lengthKm,
            areaKm2: prov.areaKm2,
            department: {
                id: prov.departmentId,
                code: prov.departmentCode,
                name: prov.departmentName,
            },
        }));
    },
};

const districtQueries = {
    async find({
        id,
        ubigeo,
        name,
        departmentId,
        departmentCode,
        departmentName,
        provinceId,
        provinceCode,
        provinceName,
    }: {
        id?: string;
        ubigeo?: string;
        name?: string;
        departmentId?: string;
        departmentCode?: string;
        departmentName?: string;
        provinceId?: string;
        provinceCode?: string;
        provinceName?: string;
    }): Promise<DistrictProperties[] | null> {
        const filters: SQL[] = [];

        if (id) filters.push(eq(peruDistricts.id, id));
        if (ubigeo) filters.push(eq(peruDistricts.ubigeo, ubigeo));
        if (name) filters.push(ilike(peruDistricts.name, name.toLowerCase()));
        if (departmentId) filters.push(eq(peruDepartments.id, departmentId));
        if (departmentCode) filters.push(eq(peruDepartments.code, departmentCode));
        if (departmentName)
            filters.push(ilike(peruDepartments.name, departmentName.toLowerCase()));
        if (provinceId) filters.push(eq(peruProvinces.id, provinceId));
        if (provinceCode) filters.push(eq(peruProvinces.code, provinceCode));
        if (provinceName)
            filters.push(ilike(peruDepartments.name, provinceName.toLowerCase()));

        const results = await db
            .select({
                id: peruDistricts.id,
                ubigeo: peruDistricts.ubigeo,
                name: peruDistricts.name,
                lengthDeg: peruDistricts.lengthDeg,
                areaDeg2: peruDistricts.areaDeg2,
                lengthKm: peruDistricts.lengthKm,
                areaKm2: peruDistricts.areaKm2,
                geometry: sql`ST_AsGeoJSON(${peruDistricts.geometry})::json`.as(
                    "geometry"
                ),
                departmentId: peruDepartments.id,
                departmentCode: peruDepartments.code,
                departmentName: peruDepartments.name,
                provinceId: peruProvinces.id,
                provinceCode: peruProvinces.code,
                provinceName: peruProvinces.name,
            })
            .from(peruDistricts)
            .innerJoin(
                peruDepartments,
                eq(peruProvinces.departmentId, peruDepartments.id)
            )
            .innerJoin(peruProvinces, eq(peruDistricts.provinceId, peruProvinces.id))
            .where(and(...filters));

        if (results.length === 0) return null;

        return results.map((dist) => ({
            id: dist.id,
            ubigeo: dist.ubigeo,
            name: dist.name,
            geometry: dist.geometry as GeoJSONGeometry,
            lengthDeg: dist.lengthDeg,
            areaDeg2: dist.areaDeg2,
            lengthKm: dist.lengthKm,
            areaKm2: dist.areaKm2,
            department: {
                id: dist.departmentId,
                code: dist.departmentCode,
                name: dist.departmentName,
            },
            province: {
                id: dist.provinceId,
                code: dist.provinceCode,
                name: dist.provinceName,
            },
        }));
    },
    async contains({
        lat,
        lng,
    }: {
        lat: number;
        lng: number;
    }): Promise<DistrictProperties | null> {
        const results = await db
            .select({
                id: peruDistricts.id,
                ubigeo: peruDistricts.ubigeo,
                name: peruDistricts.name,
                geometry: sql`ST_AsGeoJSON(${peruDistricts.geometry})::json`.as(
                    "geometry"
                ),
                lengthDeg: peruDistricts.lengthDeg,
                areaDeg2: peruDistricts.areaDeg2,
                lengthKm: peruDistricts.lengthKm,
                areaKm2: peruDistricts.areaKm2,
                departmentId: peruDepartments.id,
                departmentCode: peruDepartments.code,
                departmentName: peruDepartments.name,
                provinceId: peruProvinces.id,
                provinceCode: peruProvinces.code,
                provinceName: peruProvinces.name,
            })
            .from(peruDistricts)
            .innerJoin(
                peruDepartments,
                eq(peruDistricts.departmentId, peruDepartments.id)
            )
            .innerJoin(peruProvinces, eq(peruDistricts.provinceId, peruProvinces.id))
            .where(
                sql`ST_Intersects(
                    ${peruDistricts.geometry},
                    ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)
                )`
            )
            .limit(1);

        if (results.length === 0) {
            return null;
        }

        const district = results[0];

        return {
            id: district.id,
            ubigeo: district.ubigeo,
            name: district.name,
            lengthDeg: district.lengthDeg,
            areaDeg2: district.areaDeg2,
            lengthKm: district.lengthKm,
            areaKm2: district.areaKm2,
            geometry: district.geometry as GeoJSONGeometry,
            department: {
                id: district.departmentId,
                code: district.departmentCode,
                name: district.departmentName,
            },
            province: {
                id: district.provinceId,
                code: district.provinceCode,
                name: district.provinceName,
            },
        };
    },
};

export const geoQueries = {
    departments: departmentQueries,
    provinces: provincesQueries,
    districts: districtQueries,
};
