"use client";

import * as React from "react";

import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { useMap } from "@/hooks";
import { ComboBox, ComboboxOption } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { MapSearchBar } from "./map-search-bar";

export const MapToolBar = () => {
    const { showEcoPinCard } = useMap();
    const [selectedDepartment, setSelectedDepartment] = React.useState<string>("");
    const [selectedProvince, setSelectedProvince] = React.useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");

    const [visibility, setVisibility] = React.useState({
        department: false,
        province: false,
        district: false,
    });

    const anyFiltersVisible =
        visibility.department || visibility.province || visibility.district;
    const filtersApplied = selectedDepartment || selectedProvince || selectedDistrict;

    const handleDepartmentSelect = (value: string) => {
        setSelectedDepartment(value);
        setSelectedProvince("");
        setSelectedDistrict("");

        setVisibility({
            department: true,
            province: true,
            district: false,
        });
    };

    const handleProvinceSelect = (value: string) => {
        setSelectedProvince(value);
        setSelectedDistrict("");

        setVisibility((prev) => ({
            ...prev,
            district: true,
        }));
    };

    const handleDistrictSelect = (value: string) => {
        setSelectedDistrict(value);
    };

    const ResetButton = ({ show }: { show: boolean }) => (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <Button
                        className="bg-primary h-fit"
                        onClick={() => {
                            setSelectedDepartment("");
                            setSelectedProvince("");
                            setSelectedDistrict("");
                            setVisibility({
                                department: true,
                                province: false,
                                district: false,
                            });
                        }}
                    >
                        Reiniciar
                        <RotateCcw className="ml-1 h-4 w-4" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const onClickFilterButton = () => {
        const { department, province, district } = visibility;

        if (department || province || district) {
            // If any are visible, hide all
            setVisibility({ department: false, province: false, district: false });
        } else {
            // Open appropriate levels based on selection state
            if (selectedProvince) {
                setVisibility({ department: true, province: true, district: true });
            } else if (selectedDepartment) {
                setVisibility({ department: true, province: true, district: false });
            } else {
                setVisibility({ department: true, province: false, district: false });
            }
        }
    };

    return (
        <div
            className={cn(
                "absolute right-0 bottom-2 left-0 z-40 flex flex-col gap-y-2 px-2 transition-all duration-500 ease-in-out md:top-2 md:bottom-auto md:left-[calc(25%+3rem)] md:w-1/2 md:flex-col-reverse xl:left-1/4",
                showEcoPinCard ? "lg:w-[17rem] xl:w-[20rem]" : "xl:w-[780px]"
            )}
        >
            <div className="hidden text-end xl:block">
                <ResetButton show={visibility.district} />
            </div>

            <div className="flex flex-col md:flex-col-reverse xl:flex-row xl:space-x-2">
                <div className="flex flex-row justify-between xl:space-x-2">
                    <AnimatedCombobox
                        placeholder="Selecciona el departamento"
                        show={visibility.department}
                        options={peruvianRegions}
                        setOption={handleDepartmentSelect}
                        selectedOption={selectedDepartment}
                    />
                    <ResetButton
                        show={
                            visibility.department &&
                            !(visibility.province || visibility.district)
                        }
                    />
                </div>
                <div
                    className={`flex flex-row justify-between ${visibility.province ? "mt-2 md:mt-0 md:mb-2 xl:m-0 xl:space-x-2" : ""}`}
                >
                    <AnimatedCombobox
                        placeholder="Selecciona la provincia"
                        show={visibility.province}
                        options={peruvianRegions}
                        setOption={handleProvinceSelect}
                        selectedOption={selectedProvince}
                    />
                    <ResetButton show={visibility.province && !visibility.district} />
                </div>

                <div
                    className={`flex flex-row justify-between ${visibility.district ? "mt-2 md:mt-0 md:mb-2 xl:m-0 xl:ml-2 xl:space-x-2" : ""}`}
                >
                    <AnimatedCombobox
                        placeholder="Selecciona el distrito"
                        show={visibility.district}
                        options={peruvianRegions}
                        setOption={handleDistrictSelect}
                        selectedOption={selectedDistrict}
                    />
                    <div className="xl:hidden">
                        <ResetButton show={visibility.district} />
                    </div>
                </div>
            </div>
            <div className="bg-foreground mx-auto flex w-full flex-row items-center justify-between space-x-2 rounded-lg p-2 shadow-lg">
                <MapSearchBar />
                <div className="bg-muted h-4 w-0.5 rounded-lg" />
                <Button
                    variant="ghost"
                    onClick={onClickFilterButton}
                    className={cn(
                        "text-background transition-colors",
                        anyFiltersVisible && "bg-muted text-muted-foreground",
                        filtersApplied &&
                            !anyFiltersVisible &&
                            "bg-accent text-accent-foreground"
                    )}
                >
                    <SlidersHorizontal size={18} />
                </Button>
            </div>
        </div>
    );
};

interface AnimatedComboboxProps {
    show: boolean;
    placeholder: string;
    options: ComboboxOption[];
    selectedOption: string;
    setOption: (value: string) => void;
}

const AnimatedCombobox = ({
    show,
    placeholder,
    options,
    selectedOption,
    setOption,
}: AnimatedComboboxProps) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex items-center"
                >
                    <ComboBox
                        placeholder={placeholder}
                        options={options}
                        setOption={setOption}
                        selectedOption={selectedOption}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const peruvianRegions: ComboboxOption[] = [
    { value: "amazonas", label: "La provincia con un nombre super largo" },
    { value: "ancash", label: "Áncash" },
    { value: "apurimac", label: "Apurímac" },
    { value: "arequipa", label: "Arequipa" },
    { value: "ayacucho", label: "Ayacucho" },
    { value: "cajamarca", label: "Cajamarca" },
    { value: "callao", label: "Callao" },
    { value: "cusco", label: "Cusco" },
    { value: "huancavelica", label: "Huancavelica" },
    { value: "huanuco", label: "Huánuco" },
    { value: "ica", label: "Ica" },
    { value: "junin", label: "Junín" },
    { value: "la_libertad", label: "La Libertad" },
    { value: "lambayeque", label: "Lambayeque" },
    { value: "lima", label: "Lima" },
    { value: "loreto", label: "Loreto" },
    { value: "madre_de_dios", label: "Madre de Dios" },
    { value: "moquegua", label: "Moquegua" },
    { value: "pasco", label: "Pasco" },
    { value: "piura", label: "Piura" },
    { value: "puno", label: "Puno" },
    { value: "san_martin", label: "San Martín" },
    { value: "tacna", label: "Tacna" },
    { value: "tumbes", label: "Tumbes" },
    { value: "ucayali", label: "Ucayali" },
];
