import db from "@/lib/database/db";
import { GeoDepartmentQueryBuilder } from "@/lib/database/queries/geo/departments";
import { GeoProvinceQueryBuilder } from "@/lib/database/queries/geo/provinces";
import { GeoDistrictQueryBuilder } from "@/lib/database/queries/geo/districts";

export const geoQueries = {
    departments: () => new GeoDepartmentQueryBuilder(db),
    provinces: () => new GeoProvinceQueryBuilder(db),
    districts: () => new GeoDistrictQueryBuilder(db),
};
