"use client";

import { Button } from "@/components/ui/button";
import { useMapGeoFilter } from "@/hooks/use-map-geo-filter";
import { cn } from "@/lib/utils/cn";
import { SlidersHorizontal } from "lucide-react";

export const MapGeoFilterToggleButton = () => {
    const {
        hasActiveFilters,
        anyDropdownVisible,
        toggleFilters, // renamed from onClickFilterButton
    } = useMapGeoFilter();

    return (
        <Button
            variant="ghost"
            onClick={toggleFilters}
            className={cn(
                "text-background transition-colors",
                anyDropdownVisible && "bg-muted text-muted-foreground",
                hasActiveFilters &&
                    !anyDropdownVisible &&
                    "bg-accent text-accent-foreground"
            )}
        >
            <SlidersHorizontal size={18} />
        </Button>
    );
};
