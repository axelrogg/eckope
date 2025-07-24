import { relations } from "drizzle-orm/relations";
import { peruDepartments, peruDistricts, peruProvinces } from "./schema";

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

export const peruDepartmentsRelations = relations(peruDepartments, ({ many }) => ({
    peruDistricts: many(peruDistricts),
    peruProvinces: many(peruProvinces),
}));

export const peruProvincesRelations = relations(peruProvinces, ({ one, many }) => ({
    peruDistricts: many(peruDistricts),
    peruDepartment: one(peruDepartments, {
        fields: [peruProvinces.departmentId],
        references: [peruDepartments.id],
    }),
}));
