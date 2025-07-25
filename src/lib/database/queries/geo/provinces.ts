import { and, eq, ilike, or, sql, SQL } from "drizzle-orm";
import { Geometry } from "geojson";

import { peruDepartments, peruProvinces } from "@root/drizzle/schema";
import { Database } from "@/lib/database/db";
import { projectSQLGeometry } from "@/lib/utils/project-geometry";
import { FilterLogic, PeruProvince, WhereClauseParams } from "@/types/database";

export class GeoProvinceQueryBuilder {
    private filters: SQL[] = [];
    private logic: FilterLogic = "and";

    constructor(private db: Database) {
        console.log(
            "[GeoProvinceQueryBuilder] Initialized with empty filters and default 'and' logic."
        );
    }

    where({
        logic,
        params,
    }: WhereClauseParams<
        Partial<{
            id?: string;
            code?: string;
            name?: string;
            department?: {
                id?: string;
                code?: string;
                name?: string;
            };
        }>
    >) {
        if (logic) {
            console.log(`[GeoProvinceQueryBuilder] Setting filter logic to '${logic}'`);
            this.logic = logic;
        }

        if (params.id) {
            console.log(`[GeoProvinceQueryBuilder] Adding filter: id = '${params.id}'`);
            this.filters.push(eq(peruProvinces.id, params.id));
        }

        if (params.code) {
            console.log(
                `[GeoProvinceQueryBuilder] Adding filter: code = '${params.code}'`
            );
            this.filters.push(eq(peruProvinces.code, params.code));
        }

        if (params.name) {
            console.log(
                `[GeoProvinceQueryBuilder] Adding filter: name ilike '${params.name}'`
            );
            this.filters.push(ilike(peruProvinces.name, params.name.toLowerCase()));
        }

        if (params.department) {
            if (params.department.id) {
                console.log(
                    `[GeoProvinceQueryBuilder] Adding filter: department.id = '${params.department.id}'`
                );
                this.filters.push(eq(peruDepartments.id, params.department.id));
            }
            if (params.department.code) {
                console.log(
                    `[GeoProvinceQueryBuilder] Adding filter: department.code = '${params.department.code}'`
                );

                this.filters.push(eq(peruDepartments.code, params.department.code));
            }
            if (params.department.name) {
                console.log(
                    `[GeoProvinceQueryBuilder] Adding filter: department.name ilike '${params.department.name}'`
                );

                this.filters.push(
                    ilike(peruDepartments.name, params.department.name.toLowerCase())
                );
            }
        }

        return this;
    }

    containsPoint({ lat, lng }: { lat: number; lng: number }) {
        console.log(
            `[GeoProvinceQueryBuilder] Adding spatial filter: contains point (${lat}, ${lng})`
        );
        this.filters.push(
            sql`ST_Intersects(
                ${peruProvinces.geometry},
                ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)
            )`
        );
        return this;
    }

    async findMany(): Promise<PeruProvince[]> {
        const whereClause =
            this.filters.length > 0
                ? this.logic === "and"
                    ? and(...this.filters)
                    : or(...this.filters)
                : undefined;
        console.log("[GeoProvinceQueryBuilder] Executing findMany with filters:", {
            logic: this.logic,
            count: this.filters.length,
            filters: this.filters,
        });

        const query = this.db
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
                geometry: projectSQLGeometry(peruProvinces.geometry),
            })
            .from(peruProvinces)
            .where(whereClause)
            .innerJoin(
                peruDepartments,
                eq(peruProvinces.departmentId, peruDepartments.id)
            );

        console.log(
            `[GeoProvinceQueryBuilder] generated the following query ${JSON.stringify(query.toSQL(), null, 2)}.`
        );

        const results = await query;

        console.log(`[GeoProvinceQueryBuilder] ${results.length} provinces retrieved.`);

        return results.map((prov) => ({
            id: prov.id,
            code: prov.code,
            name: prov.name,
            department: {
                id: prov.departmentId,
                code: prov.departmentCode,
                name: prov.departmentName,
            },
            geometry: prov.geometry as Geometry,
            lengthDeg: prov.lengthDeg,
            areaDeg2: prov.areaDeg2,
            lengthKm: prov.lengthKm,
            areaKm2: prov.areaKm2,
        }));
    }

    async findOne(): Promise<PeruProvince | null> {
        console.log("[GeoProvinceQueryBuilder] Executing findOne()");
        const all = await this.findMany();
        const result = all[0] ?? null;
        console.log(
            `[GeoProvinceQueryBuilder] findOne() result:`,
            result ? "Found" : "Not found"
        );

        return result;
    }
}
