import {
    pgTable,
    check,
    integer,
    varchar,
    foreignKey,
    unique,
    uuid,
    timestamp,
    text,
    doublePrecision,
    geometry,
    boolean,
    pgSchema,
    bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const nextAuth = pgSchema("next_auth");

export const spatialRefSys = pgTable(
    "spatial_ref_sys",
    {
        srid: integer().notNull(),
        authName: varchar("auth_name", { length: 256 }),
        authSrid: integer("auth_srid"),
        srtext: varchar({ length: 2048 }),
        proj4Text: varchar({ length: 2048 }),
    },
    () => [check("spatial_ref_sys_srid_check", sql`(srid > 0) AND (srid <= 998999)`)]
);

export const ecoVotes = pgTable(
    "eco_votes",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid("user_id").notNull(),
        ecoId: uuid("eco_id").notNull(),
        voteType: varchar("vote_type", { length: 10 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.ecoId],
            foreignColumns: [ecos.id],
            name: "eco_votes_eco_id_fkey",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [usersInNextAuth.id],
            name: "eco_votes_user_id_fkey",
        }).onDelete("set null"),
        unique("eco_votes_user_id_eco_id_key").on(table.userId, table.ecoId),
        check(
            "eco_votes_vote_type_check",
            sql`(vote_type)::text = ANY ((ARRAY['up'::character varying, 'down'::character varying])::text[])`
        ),
    ]
);

export const ecoReplyVotes = pgTable(
    "eco_reply_votes",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid("user_id"),
        ecoReplyId: uuid("eco_reply_id").notNull(),
        voteType: varchar("vote_type", { length: 10 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.ecoReplyId],
            foreignColumns: [ecoReplies.id],
            name: "eco_reply_votes_eco_reply_id_fkey",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [usersInNextAuth.id],
            name: "eco_reply_votes_user_id_fkey",
        }).onDelete("set null"),
        unique("eco_reply_votes_user_id_eco_reply_id_key").on(
            table.userId,
            table.ecoReplyId
        ),
        check(
            "eco_reply_votes_vote_type_check",
            sql`(vote_type)::text = ANY ((ARRAY['up'::character varying, 'down'::character varying])::text[])`
        ),
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

export const ecos = pgTable(
    "ecos",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid("user_id"),
        ecoPinId: uuid("eco_pin_id").notNull(),
        content: varchar({ length: 40000 }).notNull(),
        upvotes: integer().default(0).notNull(),
        downvotes: integer().default(0).notNull(),
        edited: boolean().default(false).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.ecoPinId],
            foreignColumns: [ecoPins.id],
            name: "ecos_eco_pin_id_fkey",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [usersInNextAuth.id],
            name: "ecos_user_id_fkey",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    ]
);

export const ecoReplies = pgTable(
    "eco_replies",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid("user_id"),
        ecoId: uuid("eco_id").notNull(),
        content: varchar({ length: 20000 }).notNull(),
        upvotes: integer().default(0).notNull(),
        downvotes: integer().default(0).notNull(),
        edited: boolean().default(false).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.ecoId],
            foreignColumns: [ecos.id],
            name: "eco_replies_eco_id_fkey",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [usersInNextAuth.id],
            name: "eco_replies_user_id_fkey",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    ]
);

export const ecoPinVotes = pgTable(
    "eco_pin_votes",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid("user_id").notNull(),
        ecoPinId: uuid("eco_pin_id").notNull(),
        voteType: varchar("vote_type", { length: 10 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.ecoPinId],
            foreignColumns: [ecoPins.id],
            name: "eco_pin_votes_eco_pin_id_fkey",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [usersInNextAuth.id],
            name: "eco_pin_votes_user_id_fkey",
        }).onDelete("set null"),
        unique("eco_pin_votes_user_id_eco_pin_id_key").on(table.userId, table.ecoPinId),
        check(
            "eco_pin_votes_vote_type_check",
            sql`(vote_type)::text = ANY ((ARRAY['up'::character varying, 'down'::character varying])::text[])`
        ),
    ]
);

export const ecoPins = pgTable(
    "eco_pins",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid("user_id"),
        title: varchar({ length: 300 }).notNull(),
        content: varchar({ length: 40000 }).notNull(),
        category: varchar({ length: 100 }).notNull(),
        customCategory: varchar("custom_category", { length: 100 }),
        severity: varchar({ length: 100 }).notNull(),
        upvotes: integer().default(0).notNull(),
        downvotes: integer().default(0).notNull(),
        edited: boolean().default(false).notNull(),
        location: geometry({ type: "point", srid: 4326 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [usersInNextAuth.id],
            name: "eco_pins_user_id_fkey",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    ]
);

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

export const usersInNextAuth = nextAuth.table(
    "users",
    {
        id: uuid()
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        name: text(),
        email: text(),
        emailVerified: timestamp({ withTimezone: true, mode: "string" }),
        image: text(),
    },
    (table) => [unique("email_unique").on(table.email)]
);

export const sessionsInNextAuth = nextAuth.table(
    "sessions",
    {
        id: uuid()
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        expires: timestamp({ withTimezone: true, mode: "string" }).notNull(),
        sessionToken: text().notNull(),
        userId: uuid(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [usersInNextAuth.id],
            name: "sessions_userId_fkey",
        }).onDelete("cascade"),
        unique("sessiontoken_unique").on(table.sessionToken),
    ]
);

export const accountsInNextAuth = nextAuth.table(
    "accounts",
    {
        id: uuid()
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        type: text().notNull(),
        provider: text().notNull(),
        providerAccountId: text().notNull(),
        refreshToken: text("refresh_token"),
        accessToken: text("access_token"),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        expiresAt: bigint("expires_at", { mode: "number" }),
        tokenType: text("token_type"),
        scope: text(),
        idToken: text("id_token"),
        sessionState: text("session_state"),
        oauthTokenSecret: text("oauth_token_secret"),
        oauthToken: text("oauth_token"),
        userId: uuid(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [usersInNextAuth.id],
            name: "accounts_userId_fkey",
        }).onDelete("cascade"),
        unique("provider_unique").on(table.provider, table.providerAccountId),
    ]
);

export const verificationTokensInNextAuth = nextAuth.table(
    "verification_tokens",
    {
        identifier: text(),
        token: text().primaryKey().notNull(),
        expires: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    },
    (table) => [unique("token_identifier_unique").on(table.identifier, table.token)]
);
