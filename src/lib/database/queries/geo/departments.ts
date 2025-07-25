import { and, ilike, or, sql, SQL } from "drizzle-orm";
import { Geometry } from "geojson";

import { peruDepartments } from "@root/drizzle/schema";
import { Database } from "@/lib/database/db";
import { projectSQLGeometry } from "@/lib/utils/project-geometry";
import { FilterLogic, PeruDepartment, WhereClauseParams } from "@/types/database";

export class GeoDepartmentQueryBuilder {
    private filters: SQL[] = [];
    private logic: FilterLogic = "and";

    constructor(private db: Database) {
        console.log(
            "[GeoDepartmentQueryBuilder] Initialized with empty filters and default 'and' logic."
        );
    }

    where({
        logic,
        params,
    }: WhereClauseParams<Partial<Pick<PeruDepartment, "id" | "name" | "code">>>) {
        if (logic) {
            console.log(`[GeoDepartmentQueryBuilder] Setting filter logic to '${logic}'`);
            this.logic = logic;
        }
        if (params.id) {
            console.log(
                `[GeoDepartmentQueryBuilder] Adding filter: id ilike '${params.id}'`
            );
            this.filters.push(ilike(peruDepartments.id, params.id));
        }
        if (params.code) {
            console.log(
                `[GeoDepartmentQueryBuilder] Adding filter: code ilike '${params.code}'`
            );
            this.filters.push(ilike(peruDepartments.code, params.code));
        }
        if (params.name) {
            console.log(
                `[GeoDepartmentQueryBuilder] Adding filter: name ilike '${params.name}'`
            );
            this.filters.push(ilike(peruDepartments.name, params.name));
        }

        return this;
    }

    containsPoint({ lat, lng }: { lat: number; lng: number }) {
        console.log(
            `[GeoDepartmentQueryBuilder] Adding spatial filter: contains point (${lat}, ${lng})`
        );
        this.filters.push(
            sql`ST_Intersects(
                ${peruDepartments.geometry},
                    ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)
            )`
        );
        return this;
    }

    async findMany(): Promise<PeruDepartment[]> {
        const whereClause =
            this.filters.length > 0
                ? this.logic === "and"
                    ? and(...this.filters)
                    : or(...this.filters)
                : undefined;

        console.log("[GeoDepartmentQueryBuilder] Executing findMany with filters:", {
            logic: this.logic,
            count: this.filters.length,
            filters: this.filters,
        });

        const query = this.db
            .select({
                id: peruDepartments.id,
                code: peruDepartments.code,
                name: peruDepartments.name,
                lengthDeg: peruDepartments.lengthDeg,
                areaDeg2: peruDepartments.areaDeg2,
                lengthKm: peruDepartments.lengthKm,
                areaKm2: peruDepartments.areaKm2,
                geometry: projectSQLGeometry(peruDepartments.geometry),
            })
            .from(peruDepartments)
            .where(whereClause);

        console.log(
            `[GeoDepartmentQueryBuilder] generated the following query ${JSON.stringify(query.toSQL(), null, 2)}.`
        );

        const departments = await query;

        console.log(
            `[GeoDepartmentQueryBuilder] ${departments.length} departments retrieved.`
        );

        return departments.map((dep) => ({
            id: dep.id,
            code: dep.code,
            name: dep.name,
            geometry: dep.geometry as Geometry,
            lengthDeg: dep.lengthDeg,
            areaDeg2: dep.areaDeg2,
            lengthKm: dep.lengthKm,
            areaKm2: dep.areaKm2,
        }));
    }

    async findOne(): Promise<PeruDepartment | null> {
        console.log("[GeoDepartmentQueryBuilder] Executing findOne()");

        const all = await this.findMany();
        const result = all[0] ?? null;

        console.log(
            `[GeoDepartmentQueryBuilder] findOne() result:`,
            result ? "Found" : "Not found"
        );

        return result;
    }
}
