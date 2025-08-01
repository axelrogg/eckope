"use client";

import * as React from "react";
import {
    GeoFilterOptions,
    GeoFilterSelection,
    GeoFilterVisibility,
    PeruDepartmentResponse,
    PeruDistrictResponse,
    PeruProvinceResponse,
} from "@/types/geo-filter";

type MapGeoFilterContextType = {
    geoOptions: GeoFilterOptions;
    geoSelection: GeoFilterSelection;
    visibility: GeoFilterVisibility;
    anyDropdownVisible: boolean;
    hasActiveFilters: boolean;
    handleDepartmentSelect: (code: string) => void;
    handleProvinceSelect: (code: string) => void;
    handleDistrictSelect: (ubigeo: string) => void;
    toggleFilters: () => void;
    resetFilters: () => void;
};

export const MapGeoFilterContext = React.createContext<MapGeoFilterContextType | null>(
    null
);

export const MapGeoFilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [geoOptions, setGeoOptions] = React.useState<GeoFilterOptions>({
        departmentList: [],
        provinceList: [],
        districtList: [],
    });

    const [geoSelection, setGeoSelection] = React.useState<GeoFilterSelection>({
        departmentCode: "",
        provinceCode: "",
        districtUbigeo: "",
    });

    const [visibility, setVisibility] = React.useState<GeoFilterVisibility>({
        department: false,
        province: false,
        district: false,
    });

    const anyDropdownVisible = Object.values(visibility).some(Boolean);
    const hasActiveFilters = Object.values(geoSelection).some(Boolean);

    /** Fetch department list on mount */
    React.useEffect(() => {
        fetchDepartments();
    }, []);

    /** Fetch provinces when department changes */
    React.useEffect(() => {
        if (geoSelection.departmentCode) {
            fetchProvinces(geoSelection.departmentCode);
        }
    }, [geoSelection.departmentCode]);

    /** Fetch districts when province changes */
    React.useEffect(() => {
        if (geoSelection.provinceCode) {
            fetchDistricts(geoSelection.departmentCode, geoSelection.provinceCode);
        }
    }, [geoSelection.departmentCode, geoSelection.provinceCode]);

    const fetchDepartments = async () => {
        try {
            const res = await fetch("/api/geo/departments");
            if (!res.ok) throw new Error("Failed to fetch departments");
            const data = (await res.json()) as PeruDepartmentResponse[];
            setGeoOptions((prev) => ({ ...prev, departmentList: data }));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProvinces = async (departmentCode: string) => {
        try {
            const res = await fetch(
                `/api/geo/provinces?department_code=${departmentCode}`
            );
            if (!res.ok) throw new Error("Failed to fetch provinces");
            const data = (await res.json()) as PeruProvinceResponse[];
            setGeoOptions((prev) => ({ ...prev, provinceList: data }));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDistricts = async (departmentCode: string, provinceCode: string) => {
        try {
            const res = await fetch(
                `/api/geo/districts?department_code=${departmentCode}&province_code=${provinceCode}`
            );
            if (!res.ok) throw new Error("Failed to fetch districts");
            const data = (await res.json()) as PeruDistrictResponse[];
            setGeoOptions((prev) => ({ ...prev, districtList: data }));
        } catch (err) {
            console.error(err);
        }
    };

    /** Handle department selection */
    const handleDepartmentSelect = (code: string) => {
        setGeoSelection({
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

    /** Handle province selection */
    const handleProvinceSelect = (code: string) => {
        setGeoSelection((prev) => ({
            ...prev,
            provinceCode: code,
            districtUbigeo: "",
        }));
        setVisibility((prev) => ({ ...prev, district: true }));
    };

    /** Handle district selection */
    const handleDistrictSelect = (ubigeo: string) => {
        setGeoSelection((prev) => ({
            ...prev,
            districtUbigeo: ubigeo,
        }));
    };

    /** Toggle filter dropdowns open/close based on selection state */
    const toggleFilters = () => {
        const { department, province, district } = visibility;

        if (department || province || district) {
            setVisibility({ department: false, province: false, district: false });
        } else {
            if (geoSelection.provinceCode) {
                setVisibility({ department: true, province: true, district: true });
            } else if (geoSelection.departmentCode) {
                setVisibility({ department: true, province: true, district: false });
            } else {
                setVisibility({ department: true, province: false, district: false });
            }
        }
    };

    /** Reset all filters and reopen department dropdown */
    const resetFilters = () => {
        setGeoSelection({
            departmentCode: "",
            provinceCode: "",
            districtUbigeo: "",
        });
        setVisibility({
            department: true,
            province: false,
            district: false,
        });
    };

    return (
        <MapGeoFilterContext.Provider
            value={{
                geoOptions,
                geoSelection,
                visibility,
                anyDropdownVisible,
                hasActiveFilters,
                handleDepartmentSelect,
                handleProvinceSelect,
                handleDistrictSelect,
                toggleFilters,
                resetFilters,
            }}
        >
            {children}
        </MapGeoFilterContext.Provider>
    );
};
