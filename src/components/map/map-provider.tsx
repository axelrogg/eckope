"use client";

import { createContext, useState } from "react";

export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [location, setLocation] = useState<MapLocation | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const providerValue = { location, setLocation, searchQuery, setSearchQuery };

    return <MapContext.Provider value={providerValue}>{children}</MapContext.Provider>;
};
