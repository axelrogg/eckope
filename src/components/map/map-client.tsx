"use client";

import dynamic from "next/dynamic";

export const MapClient = dynamic(
    () => import("@/components/map/map-core").then((mod) => mod.MapCore),
    {
        ssr: false,
    }
);
