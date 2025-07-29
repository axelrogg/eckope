"use client";

import * as React from "react";
import { EcoPin } from "@/types/eco";
import { MapContextType, MapLocation } from "@/types/map";

export const MapContext = React.createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [location, setLocation] = React.useState<MapLocation | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedEcoPin, setSelectedEcoPin] = React.useState<EcoPin | null>(null);
    const [showEcoPinPanel, setShowEcoPinPanel] = React.useState(false);
    const [newEcoPinLocation, setNewEcoPinLocation] = React.useState<MapLocation | null>(
        null
    );
    const [showNewEcoPinPrompt, setShowNewEcoPinPrompt] = React.useState(false);

    const [showNewEcoSidePanel, setShowNewEcoSidePanel] = React.useState(false);

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
        showNewEcoSidePanel,
        setShowNewEcoSidePanel,
    };

    return <MapContext.Provider value={providerValue}>{children}</MapContext.Provider>;
};
