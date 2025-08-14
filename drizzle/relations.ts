import { relations } from "drizzle-orm/relations";
import {
    ecos,
    ecoVotes,
    usersInNextAuth,
    peruDepartments,
    peruProvinces,
    ecoPins,
    ecoReplies,
    ecoPinVotes,
    peruDistricts,
    sessionsInNextAuth,
    accountsInNextAuth,
} from "./schema";

export const ecoVotesRelations = relations(ecoVotes, ({ one }) => ({
    eco: one(ecos, {
        fields: [ecoVotes.ecoId],
        references: [ecos.id],
    }),
    usersInNextAuth: one(usersInNextAuth, {
        fields: [ecoVotes.userId],
        references: [usersInNextAuth.id],
    }),
}));

export const ecosRelations = relations(ecos, ({ one, many }) => ({
    ecoVotes: many(ecoVotes),
    ecoPin: one(ecoPins, {
        fields: [ecos.ecoPinId],
        references: [ecoPins.id],
    }),
    usersInNextAuth: one(usersInNextAuth, {
        fields: [ecos.userId],
        references: [usersInNextAuth.id],
    }),
    ecoReplies: many(ecoReplies),
}));

export const usersInNextAuthRelations = relations(usersInNextAuth, ({ many }) => ({
    ecoVotes: many(ecoVotes),
    ecos: many(ecos),
    ecoReplies: many(ecoReplies),
    ecoPinVotes: many(ecoPinVotes),
    ecoPins: many(ecoPins),
    sessionsInNextAuths: many(sessionsInNextAuth),
    accountsInNextAuths: many(accountsInNextAuth),
}));

export const peruProvincesRelations = relations(peruProvinces, ({ one, many }) => ({
    peruDepartment: one(peruDepartments, {
        fields: [peruProvinces.departmentId],
        references: [peruDepartments.id],
    }),
    peruDistricts: many(peruDistricts),
}));

export const peruDepartmentsRelations = relations(peruDepartments, ({ many }) => ({
    peruProvinces: many(peruProvinces),
    peruDistricts: many(peruDistricts),
}));

export const ecoPinsRelations = relations(ecoPins, ({ one, many }) => ({
    ecos: many(ecos),
    ecoPinVotes: many(ecoPinVotes),
    usersInNextAuth: one(usersInNextAuth, {
        fields: [ecoPins.userId],
        references: [usersInNextAuth.id],
    }),
}));

export const ecoRepliesRelations = relations(ecoReplies, ({ one }) => ({
    eco: one(ecos, {
        fields: [ecoReplies.ecoId],
        references: [ecos.id],
    }),
    usersInNextAuth: one(usersInNextAuth, {
        fields: [ecoReplies.userId],
        references: [usersInNextAuth.id],
    }),
}));

export const ecoPinVotesRelations = relations(ecoPinVotes, ({ one }) => ({
    ecoPin: one(ecoPins, {
        fields: [ecoPinVotes.ecoPinId],
        references: [ecoPins.id],
    }),
    usersInNextAuth: one(usersInNextAuth, {
        fields: [ecoPinVotes.userId],
        references: [usersInNextAuth.id],
    }),
}));

export const peruDistrictsRelations = relations(peruDistricts, ({ one }) => ({
    peruDepartment: one(peruDepartments, {
        fields: [peruDistricts.departmentId],
        references: [peruDepartments.id],
    }),
    peruProvince: one(peruProvinces, {
        fields: [peruDistricts.provinceId],
        references: [peruProvinces.id],
    }),
}));

export const sessionsInNextAuthRelations = relations(sessionsInNextAuth, ({ one }) => ({
    usersInNextAuth: one(usersInNextAuth, {
        fields: [sessionsInNextAuth.userId],
        references: [usersInNextAuth.id],
    }),
}));

export const accountsInNextAuthRelations = relations(accountsInNextAuth, ({ one }) => ({
    usersInNextAuth: one(usersInNextAuth, {
        fields: [accountsInNextAuth.userId],
        references: [usersInNextAuth.id],
    }),
}));
