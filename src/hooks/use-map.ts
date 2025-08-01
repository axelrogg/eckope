import { MapContext } from "@/components/map";
import { useContext } from "react";

export const useMap = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error("useMap must be used within MapProvider");
    }
    return context;
};
