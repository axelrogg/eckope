import { EcoPinSeverity } from "@/types/eco";
import L from "leaflet";

const DEFAULT_ICON_SIZE = 32;
const DEFAULT_ICON_SVG_SIZE = 24;
const DEFAULT_ZOOM = 10;

function getIconSize(zoom: number = DEFAULT_ZOOM): { size: number; svgSize: number } {
    const scale = zoom / 10;
    const size = Math.max(16, 24 * scale);
    const svgSize = size * 0.75; // 0.75 keeps the same proportion as default values (24 / 32 = 0.75)
    return { size, svgSize };
}

export function getPinIcon({
    zoom = DEFAULT_ZOOM,
    iconCallback,
}: {
    zoom: number;
    iconCallback: (size?: number, svgSize?: number) => L.DivIcon;
}) {
    const { size, svgSize } = getIconSize(zoom);
    return iconCallback(size, svgSize);
}

export function getEcoPinIcon({
    ecoSeverity,
    zoom = DEFAULT_ZOOM,
    iconCallback,
}: {
    ecoSeverity: EcoPinSeverity;
    zoom: number;
    iconCallback: (
        ecoSeverity: EcoPinSeverity,
        size?: number,
        svgSize?: number
    ) => L.DivIcon;
}) {
    const { size, svgSize } = getIconSize(zoom);
    return iconCallback(ecoSeverity, size, svgSize);
}

export const newEcoPinIcon = (
    size: number = DEFAULT_ICON_SIZE,
    svgSize: number = DEFAULT_ICON_SVG_SIZE
) =>
    L.divIcon({
        className: "",
        html: `
        <div class="leaflet-new-pin-wrapper" style="width: ${size}px; height: ${size}px;">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 width="${svgSize}" 
                 height="${svgSize}" 
                 viewBox="0 0 24 24"
                 fill="none" 
                 stroke="currentColor" 
                 stroke-width="2" 
                 stroke-linecap="round"
                 stroke-linejoin="round"
                 class="lucide lucide-map-pin leaflet-new-pin-icon"
            >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
        </div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
    });

export const ecoPinIcon = (
    ecoSeverity: EcoPinSeverity,
    size: number = DEFAULT_ICON_SIZE
) =>
    L.divIcon({
        className: "",
        html: `
            <div class="leaflet-eco-pin-wrapper" style="width:${size}px;height:${size}px;">
                <span class="leaflet-eco-pin">
                    <span class="leaflet-eco-pin-ping leaflet-eco-pin--${ecoSeverity}"></span>
                    <span class="leaflet-eco-pin-core leaflet-eco-pin--${ecoSeverity}"></span>
                </span>
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
    });
