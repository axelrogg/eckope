"use client";

import { Button } from "@/components/ui/button";
import { useMapGeoFilter } from "@/hooks/use-map-geo-filter";
import { cn } from "@/lib/utils/cn";
import { SlidersHorizontal } from "lucide-react";

export const MapGeoFilterToggleButton = () => {
    const { anyFiltersVisible, filtersApplied, onClickFilterButton } = useMapGeoFilter();

    return (
        <Button
            variant="ghost"
            onClick={onClickFilterButton}
            className={cn(
                "text-background transition-colors",
                anyFiltersVisible && "bg-muted text-muted-foreground",
                filtersApplied && !anyFiltersVisible && "bg-accent text-accent-foreground"
            )}
        >
            <SlidersHorizontal size={18} />
        </Button>
    );
};
