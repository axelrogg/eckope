import {
    pgTable,
    unique,
    uuid,
    varchar,
    text,
    geometry,
    doublePrecision,
    timestamp,
    integer,
    foreignKey,
    serial,
    bigint,
    primaryKey,
} from "drizzle-orm/pg-core";

export const peruDepartments = pgTable(
    "peru_departments",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        code: varchar({ length: 2 }).notNull(),
        name: text().notNull(),
        geometry: geometry({ type: "geometry", srid: 4326 }).notNull(),
        lengthDeg: doublePrecision("length_deg").notNull(),
        areaDeg2: doublePrecision("area_deg2").notNull(),
        lengthKm: doublePrecision("length_km").notNull(),
        areaKm2: doublePrecision("area_km2").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        lastUpdatedAt: timestamp("last_updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("peru_departments_code_key").on(table.code),
        unique("peru_departments_name_key").on(table.name),
    ]
);

export const spatialRefSys = pgTable("spatial_ref_sys", {
    srid: integer().notNull(),
    authName: varchar("auth_name", { length: 256 }),
    authSrid: integer("auth_srid"),
    srtext: varchar({ length: 2048 }),
    proj4Text: varchar({ length: 2048 }),
});

export const peruDistricts = pgTable(
    "peru_districts",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        departmentId: uuid("department_id"),
        provinceId: uuid("province_id"),
        ubigeo: varchar({ length: 6 }).notNull(),
        name: text().notNull(),
        lengthDeg: doublePrecision("length_deg").notNull(),
        areaDeg2: doublePrecision("area_deg2").notNull(),
        lengthKm: doublePrecision("length_km").notNull(),
        areaKm2: doublePrecision("area_km2").notNull(),
        geometry: geometry({ type: "geometry", srid: 4326 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        lastUpdatedAt: timestamp("last_updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.departmentId],
            foreignColumns: [peruDepartments.id],
            name: "peru_districts_department_id_fkey",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        foreignKey({
            columns: [table.provinceId],
            foreignColumns: [peruProvinces.id],
            name: "peru_districts_province_id_fkey",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        unique("peru_districts_department_id_provinces_id_name_key").on(
            table.departmentId,
            table.provinceId,
            table.name
        ),
        unique("peru_districts_ubigeo_key").on(table.ubigeo),
    ]
);

export const peruProvinces = pgTable(
    "peru_provinces",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        departmentId: uuid("department_id"),
        code: varchar({ length: 4 }).notNull(),
        name: text().notNull(),
        lengthDeg: doublePrecision("length_deg").notNull(),
        areaDeg2: doublePrecision("area_deg2").notNull(),
        lengthKm: doublePrecision("length_km").notNull(),
        areaKm2: doublePrecision("area_km2").notNull(),
        geometry: geometry({ type: "geometry", srid: 4326 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        lastUpdatedAt: timestamp("last_updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.departmentId],
            foreignColumns: [peruDepartments.id],
            name: "peru_provinces_department_id_fkey",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        unique("peru_provinces_department_id_name_key").on(
            table.departmentId,
            table.name
        ),
        unique("peru_provinces_code_key").on(table.code),
    ]
);

export const accounts = pgTable("accounts", {
    id: serial().primaryKey().notNull(),
    userId: integer().notNull(),
    type: varchar({ length: 255 }).notNull(),
    provider: varchar({ length: 255 }).notNull(),
    providerAccountId: varchar({ length: 255 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    expiresAt: bigint("expires_at", { mode: "number" }),
    idToken: text("id_token"),
    scope: text(),
    sessionState: text("session_state"),
    tokenType: text("token_type"),
});

export const sessions = pgTable("sessions", {
    id: serial().primaryKey().notNull(),
    userId: integer().notNull(),
    expires: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    sessionToken: varchar({ length: 255 }).notNull(),
});

export const users = pgTable("users", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    emailVerified: timestamp({ withTimezone: true, mode: "string" }),
    image: text(),
});

export const verificationToken = pgTable(
    "verification_token",
    {
        identifier: text().notNull(),
        expires: timestamp({ withTimezone: true, mode: "string" }).notNull(),
        token: text().notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.identifier, table.token],
            name: "verification_token_pkey",
        }),
    ]
);
