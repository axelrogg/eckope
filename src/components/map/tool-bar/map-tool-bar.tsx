"use client";

import * as React from "react";

import { MapSearchBar } from "@/components/map/tool-bar/search";
import {
    MapGeoFilter,
    MapGeoFilterResetButton,
    MapGeoFilterToggleButton,
} from "@/components/map/tool-bar/geo-filter";
import { useMapGeoFilter } from "@/hooks/use-map-geo-filter";
import { useSidePanel } from "@/hooks/use-side-panel";
import { cn } from "@/lib/utils/cn";

export const MapToolBar = () => {
    const { currentPanel } = useSidePanel();
    const { visibility, resetFilters } = useMapGeoFilter();

    return (
        <div
            className={cn(
                "absolute right-0 bottom-2 left-0 z-40 flex flex-col gap-y-2 px-2 transition-all duration-500 ease-in-out md:top-2 md:bottom-auto md:left-[calc(25%+3rem)] md:w-1/2 md:flex-col-reverse xl:left-1/4",
                currentPanel && currentPanel !== "newEcoPrompt"
                    ? "lg:w-[17rem] xl:w-[20rem] 2xl:w-[35rem]"
                    : "xl:w-[780px]"
            )}
        >
            <div className="hidden text-end xl:block">
                <MapGeoFilterResetButton
                    show={visibility.district}
                    onClick={resetFilters}
                />
            </div>

            <MapGeoFilter />

            <div className="bg-foreground mx-auto flex w-full flex-row items-center justify-between space-x-2 rounded-lg p-2 shadow-lg">
                <MapSearchBar />
                <div className="bg-muted h-4 w-0.5 rounded-lg" />
                <MapGeoFilterToggleButton />
            </div>
        </div>
    );
};
