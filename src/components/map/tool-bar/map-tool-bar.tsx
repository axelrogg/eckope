"use client";

import * as React from "react";

import { MapSearchBar } from "@/components/map/tool-bar/search/search-bar";
import { cn } from "@/lib/utils/cn";
import { useMap } from "@/hooks";
import { ResetMapGeoFilterButton } from "@/components/map/tool-bar/geo-filter/reset-map-geo-filter-button";
import { useMapGeoFilter } from "@/hooks/use-map-geo-filter";
import { MapGeoFilter } from "@/components/map/tool-bar/geo-filter/map-geo-filter";
import { MapGeoFilterToggleButton } from "@/components/map/tool-bar/geo-filter/toggle-button";

export const MapToolBar = () => {
    const { showEcoPinPanel } = useMap();
    const { visibility, onClickResetFilterButton } = useMapGeoFilter();

    return (
        <div
            className={cn(
                "absolute right-0 bottom-2 left-0 z-40 flex flex-col gap-y-2 px-2 transition-all duration-500 ease-in-out md:top-2 md:bottom-auto md:left-[calc(25%+3rem)] md:w-1/2 md:flex-col-reverse xl:left-1/4",
                showEcoPinPanel ? "lg:w-[17rem] xl:w-[20rem]" : "xl:w-[780px]"
            )}
        >
            <div className="hidden text-end xl:block">
                <ResetMapGeoFilterButton
                    show={visibility.district}
                    onClick={onClickResetFilterButton}
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
