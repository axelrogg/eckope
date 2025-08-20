"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { MapLocationSearchResponse } from "@/types/map";
import { Separator } from "@/components/ui/separator";

interface MapSearchAutocomplete {
    suggestions: MapLocationSearchResponse[];
    onSelect: (suggestion: MapLocationSearchResponse) => void;
    loading: boolean;
    query: string;
}

export const MapSearchAutocomplete = ({
    suggestions,
    onSelect,
    loading,
    query,
}: MapSearchAutocomplete) => {
    if (query.length < 3) return null;

    return (
        <div className="bg-foregroud absolute top-8/7 z-50 mt-2 w-full rounded-lg shadow-lg">
            {loading && (
                <div className="text-background bg-foreground flex items-center rounded-lg px-4 py-2 text-sm">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                </div>
            )}
            {!loading && suggestions.length > 0 && (
                <ul>
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.place_id}
                            className="bg-foreground text-background hover:bg-primary text-sm first:rounded-t-lg last:rounded-b-lg"
                        >
                            <li
                                onClick={() => onSelect(suggestion)}
                                className="cursor-pointer px-4 py-2"
                            >
                                {suggestion.display_name}
                            </li>
                            <Separator className="bg-background/20" />
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};
