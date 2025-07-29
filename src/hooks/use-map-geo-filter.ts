"use client";

import * as React from "react";

import { PeruDepartment, PeruDistrict, PeruProvince } from "@/types/database";
type PeruDepartmentResponse = Omit<PeruDepartment, "geometry">;
type PeruProvinceResponse = Omit<PeruProvince, "geometry">;
type PeruDistrictResponse = Omit<PeruDistrict, "geometry">;

type PeruGeoOptions = {
    departmentList: PeruDepartmentResponse[];
    provinceList: PeruProvinceResponse[];
    districtList: PeruDistrictResponse[];
};

type PeruGeoSelection = {
    departmentCode: string;
    provinceCode: string;
    districtUbigeo: string;
};

export const useMapGeoFilter = () => {
    const [peruGeoOptions, setPeruGeoOptions] = React.useState<PeruGeoOptions>({
        departmentList: [],
        provinceList: [],
        districtList: [],
    });

    const [peruGeoSelected, setPeruGeoSelected] = React.useState<PeruGeoSelection>({
        departmentCode: "",
        provinceCode: "",
        districtUbigeo: "",
    });

    const [visibility, setVisibility] = React.useState({
        department: false,
        province: false,
        district: false,
    });

    React.useEffect(() => {
        const fetchPeruDepartments = async () => {
            console.log("[MapToolBar] Fetching departments...");
            const result = await fetch("/api/geo/departments");
            if (!result.ok) {
                console.error("didnt work"); // TODO: Remove this
                return;
            }
            const departments = (await result.json()) as PeruDepartmentResponse[];
            setPeruGeoOptions((prev) => ({
                ...prev,
                departmentList: departments,
            }));
        };
        fetchPeruDepartments();
    }, []);

    React.useEffect(() => {
        if (peruGeoSelected.departmentCode === "") return;

        const fetchPeruProvinces = async () => {
            const result = await fetch(
                `/api/geo/provinces?department_code=${peruGeoSelected.departmentCode}`
            );
            if (!result.ok) {
                console.error("didnt work"); // TODO: Remove this
                return;
            }
            const provinces = (await result.json()) as PeruProvinceResponse[];
            setPeruGeoOptions((prev) => ({
                ...prev,
                provinceList: provinces,
            }));
        };
        fetchPeruProvinces();
    }, [peruGeoSelected.departmentCode]);

    React.useEffect(() => {
        if (peruGeoSelected.provinceCode === "") return;

        const fetchPeruDistricts = async () => {
            const result = await fetch(
                `/api/geo/districts?department_code=${peruGeoSelected.departmentCode}&province_code=${peruGeoSelected.provinceCode}`
            );
            if (!result.ok) {
                console.error("didnt work");
                return;
            }
            const districts = (await result.json()) as PeruDistrictResponse[];
            setPeruGeoOptions((prev) => ({
                ...prev,
                districtList: districts,
            }));
        };
        fetchPeruDistricts();
    }, [peruGeoSelected.departmentCode, peruGeoSelected.provinceCode]);

    const anyFiltersVisible =
        visibility.department || visibility.province || visibility.district;
    const filtersApplied =
        peruGeoSelected.departmentCode ||
        peruGeoSelected.provinceCode ||
        peruGeoSelected.districtUbigeo;

    const handleDepartmentSelect = (code: string) => {
        setPeruGeoSelected({
            departmentCode: code,
            provinceCode: "",
            districtUbigeo: "",
        });

        setVisibility({
            department: true,
            province: true,
            district: false,
        });
    };

    const handleProvinceSelect = (code: string) => {
        setPeruGeoSelected((prev) => ({
            ...prev,
            provinceCode: code,
            districtUbigeo: "",
        }));

        setVisibility((prev) => ({
            ...prev,
            district: true,
        }));
    };

    const handleDistrictSelect = (ubigeo: string) => {
        setPeruGeoSelected((prev) => ({
            ...prev,
            districtUbigeo: ubigeo,
        }));
    };

    const onClickFilterButton = () => {
        const { department, province, district } = visibility;

        if (department || province || district) {
            // If any are visible, hide all filter buttons
            setVisibility({ department: false, province: false, district: false });
        } else {
            // Open appropriate levels based on selection state
            if (peruGeoSelected.provinceCode) {
                setVisibility({ department: true, province: true, district: true });
            } else if (peruGeoSelected.departmentCode) {
                setVisibility({ department: true, province: true, district: false });
            } else {
                setVisibility({ department: true, province: false, district: false });
            }
        }
    };

    function onClickResetFilterButton() {
        setPeruGeoSelected({ departmentCode: "", provinceCode: "", districtUbigeo: "" });
        setVisibility({
            department: true,
            province: false,
            district: false,
        });
    }

    return {
        peruGeoOptions,
        peruGeoSelected,
        visibility,
        anyFiltersVisible,
        filtersApplied,
        handleDepartmentSelect,
        handleProvinceSelect,
        handleDistrictSelect,
        onClickFilterButton,
        onClickResetFilterButton,
    };
};
