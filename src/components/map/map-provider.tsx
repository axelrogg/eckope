"use client";

import { EcoPin } from "@/types/eco";
import { MapContextType, MapLocation } from "@/types/map";
import { createContext, useState } from "react";

export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [location, setLocation] = useState<MapLocation | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEcoPin, setSelectedEcoPin] = useState<EcoPin | null>(null);
    const [showEcoPinPanel, setShowEcoPinPanel] = useState(false);
    const [newEcoPinLocation, setNewEcoPinLocation] = useState<MapLocation | null>(null);
    const [showNewEcoPinPrompt, setShowNewEcoPinPrompt] = useState(false);

    const providerValue = {
        location,
        setLocation,
        searchQuery,
        setSearchQuery,
        selectedEcoPin,
        setSelectedEcoPin,
        showEcoPinPanel,
        setShowEcoPinPanel,
        newEcoPinLocation,
        setNewEcoPinLocation,
        showNewEcoPinPrompt,
        setShowNewEcoPinPrompt,
    };

    return <MapContext.Provider value={providerValue}>{children}</MapContext.Provider>;
};
