import { and, eq, ilike, or, sql, SQL } from "drizzle-orm";
import { Geometry } from "geojson";

import { peruDepartments, peruDistricts, peruProvinces } from "@root/drizzle/schema";
import { Database } from "@/lib/database/db";
import { projectSQLGeometry } from "@/lib/utils/project-geometry";
import { FilterLogic, PeruDistrict, WhereClauseParams } from "@/types/database";

export class GeoDistrictQueryBuilder {
    private filters: SQL[] = [];
    private logic: FilterLogic = "and";

    constructor(private db: Database) {
        console.log(
            "[GeoDistrictQueryBuilder] Initialized with empty filters and default 'and' logic."
        );
    }

    where({
        logic,
        params,
    }: WhereClauseParams<
        Partial<{
            id: string;
            ubigeo: string;
            name: string;
            departmentId: string;
            departmentCode: string;
            departmentName: string;
            provinceId: string;
            provinceCode: string;
            provinceName: string;
        }>
    >) {
        if (logic) {
            console.log(`[GeoDistrictQueryBuilder] Setting filter logic to '${logic}'`);
            this.logic = logic;
        }

        if (params.id) {
            console.log(
                `[GeoDistrictQueryBuilder] Adding filter: district.id = '${params.id}'`
            );

            this.filters.push(eq(peruDistricts.id, params.id));
        }

        if (params.ubigeo) {
            console.log(
                `[GeoDistrictQueryBuilder] Adding filter: district.ubigeo = '${params.ubigeo}'`
            );

            this.filters.push(eq(peruDistricts.ubigeo, params.ubigeo));
        }
        if (params.name) {
            console.log(
                `[GeoDistrictQueryBuilder] Adding filter: district.name ilike '${params.name}'`
            );

            this.filters.push(ilike(peruDistricts.name, params.name));
        }

        if (params.departmentId) {
            console.log(
                `[GeoDistrictQueryBuilder] Adding filter: department.id = '${params.departmentId}'`
            );

            this.filters.push(eq(peruDepartments.id, params.departmentId));
        }
        if (params.departmentCode) {
            console.log(
                `[GeoDistrictQueryBuilder] Adding filter: department.code = '${params.departmentCode}'`
            );

            this.filters.push(eq(peruDepartments.code, params.departmentCode));
        }
        if (params.departmentName) {
            console.log(
                `[GeoDistrictQueryBuilder] Adding filter: department.name ilike '${params.departmentName}'`
            );

            this.filters.push(ilike(peruDepartments.name, params.departmentName));
        }

        if (params.provinceId) {
            console.log(
                `[GeoDistrictQueryBuilder] Adding filter: province.id = '${params.provinceId}'`
            );

            this.filters.push(eq(peruProvinces.id, params.provinceId));
        }
        if (params.provinceCode) {
            console.log(
                `[GeoDistrictQueryBuilder] Adding filter: province.code = '${params.provinceCode}'`
            );

            this.filters.push(eq(peruProvinces.code, params.provinceCode));
        }
        if (params.provinceName) {
            console.log(
                `[GeoDistrictQueryBuilder] Adding filter: province.name ilike '${params.provinceName}'`
            );

            this.filters.push(ilike(peruProvinces.name, params.provinceName));
        }

        return this;
    }

    containsPoint({ lat, lng }: { lat: number; lng: number }) {
        console.log(
            `[GeoDistrictQueryBuilder] Adding spatial filter: contains point (${lat}, ${lng})`
        );
        this.filters.push(
            sql`ST_Intersects(
                ${peruDistricts.geometry},
                    ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)
            )`
        );
        return this;
    }

    async findMany(): Promise<PeruDistrict[]> {
        const whereClause =
            this.filters.length > 0
                ? this.logic === "and"
                    ? and(...this.filters)
                    : or(...this.filters)
                : undefined;

        console.log("[GeoDistrictQueryBuilder] Executing findMany with filters:", {
            logic: this.logic,
            count: this.filters.length,
            filters: this.filters,
        });

        const query = this.db
            .select({
                id: peruDistricts.id,
                name: peruDistricts.name,
                ubigeo: peruDistricts.ubigeo,
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
                geometry: projectSQLGeometry(peruDistricts.geometry),
            })
            .from(peruDistricts)
            .where(whereClause)
            .innerJoin(
                peruDepartments,
                eq(peruDistricts.departmentId, peruDepartments.id)
            )
            .innerJoin(peruProvinces, eq(peruDistricts.provinceId, peruProvinces.id));

        console.log(
            `[GeoDistrictQueryBuilder] generated the following query ${JSON.stringify(query.toSQL(), null, 2)}.`
        );

        const result = await query;
        console.log(`[GeoDistrictQueryBuilder] ${result.length} districts retrieved.`);
        return result.map((dist) => ({
            id: dist.id,
            name: dist.name,
            ubigeo: dist.ubigeo,
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
            geometry: dist.geometry as Geometry,
        }));
    }

    async findOne(): Promise<PeruDistrict | null> {
        console.log("[GeoDistrictQueryBuilder] Executing findOne()");
        const all = await this.findMany();

        const result = all[0] ?? null;
        console.log(
            `[GeoDistrictQueryBuilder] findOne() result:`,
            result ? "Found" : "Not found"
        );
        return result;
    }
}
