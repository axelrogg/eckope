import { sql } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

export function projectSQLGeometry(column: PgColumn) {
    return sql`ST_AsGeoJSON(${column})::json`.as("geometry");
}
