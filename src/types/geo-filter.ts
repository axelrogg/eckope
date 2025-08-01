import { PeruDepartment, PeruDistrict, PeruProvince } from "@/types/database";

export type PeruDepartmentResponse = Omit<PeruDepartment, "geometry">;
export type PeruProvinceResponse = Omit<PeruProvince, "geometry">;
export type PeruDistrictResponse = Omit<PeruDistrict, "geometry">;

export type GeoFilterOptions = {
    departmentList: PeruDepartmentResponse[];
    provinceList: PeruProvinceResponse[];
    districtList: PeruDistrictResponse[];
};

export type GeoFilterSelection = {
    departmentCode: string;
    provinceCode: string;
    districtUbigeo: string;
};

export type GeoFilterVisibility = {
    department: boolean;
    province: boolean;
    district: boolean;
};
