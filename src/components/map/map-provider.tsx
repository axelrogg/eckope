"use client";

import { EcoPin } from "@/types/eco";
import { MapContextType, MapLocation } from "@/types/map";
import { createContext, useState } from "react";

export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [location, setLocation] = useState<MapLocation | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [ecoPin, setEcoPin] = useState<EcoPin | null>(null);
    const [showEcoPinCard, setShowEcoPinCard] = useState(false);

    const providerValue = {
        location,
        setLocation,
        searchQuery,
        setSearchQuery,
        ecoPin,
        setEcoPin,
        showEcoPinCard,
        setShowEcoPinCard,
    };

    return <MapContext.Provider value={providerValue}>{children}</MapContext.Provider>;
};
