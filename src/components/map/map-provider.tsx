"use client";

import * as React from "react";
import { MapEcoPin, MapLocation } from "@/types/map";

type MapContextType = {
    /** Location where the map should fly to or center on */
    location: MapLocation | null;
    setLocation: (location: MapLocation | null) => void;

    /** The eco pin currently selected by the user */
    activePin: MapEcoPin | null;
    setActivePin: React.Dispatch<React.SetStateAction<MapEcoPin | null>>;

    /** Coordinates for a new pin dropped on the map (not confirmed yet) */
    pendingPin: MapLocation | null;
    setPendingPin: React.Dispatch<React.SetStateAction<MapLocation | null>>;

    /** */
    ecoPins: MapEcoPin[];
    setEcoPins: React.Dispatch<React.SetStateAction<MapEcoPin[]>>;
};

export const MapContext = React.createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [location, setLocation] = React.useState<MapLocation | null>(null);
    const [activePin, setActivePin] = React.useState<MapEcoPin | null>(null);
    const [pendingPin, setPendingPin] = React.useState<MapLocation | null>(null);
    const [ecoPins, setEcoPins] = React.useState<MapEcoPin[]>([]);

    const providerValue = {
        location,
        setLocation,
        activePin,
        setActivePin,
        pendingPin,
        setPendingPin,
        ecoPins,
        setEcoPins,
    };

    return <MapContext.Provider value={providerValue}>{children}</MapContext.Provider>;
};
