"use client";

import { AnimatedCombobox } from "@/components/map/tool-bar/geo-filter/animated-combobox";
import { ResetMapGeoFilterButton } from "@/components/map/tool-bar/geo-filter/reset-map-geo-filter-button";
import { useMapGeoFilter } from "@/hooks/use-map-geo-filter";

export const MapGeoFilter = () => {
    const {
        geoOptions,
        geoSelection,
        visibility,
        handleDepartmentSelect,
        handleProvinceSelect,
        handleDistrictSelect,
        resetFilters,
    } = useMapGeoFilter();

    return (
        <div className="flex flex-col md:flex-col-reverse xl:flex-row xl:space-x-2">
            <div className="flex flex-row justify-between xl:space-x-2">
                <AnimatedCombobox
                    placeholder="Selecciona el departamento"
                    show={visibility.department}
                    options={geoOptions.departmentList.map((dep) => ({
                        value: dep.code,
                        label: dep.name,
                    }))}
                    setOption={handleDepartmentSelect}
                    selectedOption={geoSelection.departmentCode}
                />
                <ResetMapGeoFilterButton
                    show={
                        visibility.department &&
                        !(visibility.province || visibility.district)
                    }
                    onClick={resetFilters}
                />
            </div>
            <div
                className={`flex flex-row justify-between ${visibility.province ? "mt-2 md:mt-0 md:mb-2 xl:m-0 xl:space-x-2" : ""}`}
            >
                <AnimatedCombobox
                    placeholder="Selecciona la provincia"
                    show={visibility.province}
                    options={geoOptions.provinceList.map((prov) => ({
                        value: prov.code,
                        label: prov.name,
                    }))}
                    setOption={handleProvinceSelect}
                    selectedOption={geoSelection.provinceCode}
                />
                <ResetMapGeoFilterButton
                    show={visibility.province && !visibility.district}
                    onClick={resetFilters}
                />
            </div>

            <div
                className={`flex flex-row justify-between ${visibility.district ? "mt-2 md:mt-0 md:mb-2 xl:m-0 xl:ml-2 xl:space-x-2" : ""}`}
            >
                <AnimatedCombobox
                    placeholder="Selecciona el distrito"
                    show={visibility.district}
                    options={geoOptions.districtList.map((dist) => ({
                        value: dist.ubigeo,
                        label: dist.name,
                    }))}
                    setOption={handleDistrictSelect}
                    selectedOption={geoSelection.districtUbigeo}
                />
                <div className="xl:hidden">
                    <ResetMapGeoFilterButton
                        show={visibility.district}
                        onClick={resetFilters}
                    />
                </div>
            </div>
        </div>
    );
};
