"use client";

import * as React from "react";

import { EcoPin } from "@/types/eco";
import { MapLocation } from "@/types/map";

export type MapContextType = {
    /** Location where the map should fly to or center on */
    location: MapLocation | null;
    setLocation: (location: MapLocation | null) => void;

    /** The eco pin currently selected by the user */
    activePin: EcoPin | null;
    setActivePin: (ecoPin: EcoPin | null) => void;

    /** Coordinates for a new pin dropped on the map (not confirmed yet) */
    pendingPin: MapLocation | null;
    setPendingPin: (value: MapLocation | null) => void;
};

export const MapContext = React.createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [location, setLocation] = React.useState<MapLocation | null>(null);
    const [activePin, setActivePin] = React.useState<EcoPin | null>(null);
    const [pendingPin, setPendingPin] = React.useState<MapLocation | null>(null);

    const providerValue = {
        location,
        setLocation,
        activePin,
        setActivePin,
        pendingPin,
        setPendingPin,
    };

    return <MapContext.Provider value={providerValue}>{children}</MapContext.Provider>;
};
