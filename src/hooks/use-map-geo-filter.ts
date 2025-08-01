"use client";

import { MapGeoFilterContext } from "@/components/map/tool-bar/geo-filter/geo-filter-provider";
import * as React from "react";

/**
 * Access map-based geographic filter state and actions.
 * Requires `MapGeoFilterProvider` to be present in a parent tree.
 */
export const useMapGeoFilter = () => {
    const ctx = React.useContext(MapGeoFilterContext);
    if (!ctx) throw new Error("useMapGeoFilter must be used within MapGeoFilterProvider");
    return ctx;
};
