"use client";

import * as React from "react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
    MapContainer,
    TileLayer,
    useMap as useLeafletMap,
    useMapEvents,
    Marker,
} from "react-leaflet";
import { FeatureCollection } from "geojson";
import { toast } from "sonner";

import {
    newEcoPinIcon,
    ecoPinIcon,
    getPinIcon,
    getEcoPinIcon,
} from "@/components/map/map-icons";
import { useMap, useSidePanel } from "@/hooks";
import { getContainingFeature } from "@/lib/geo/spatial";
import { MapEcoPin } from "@/types/map";
import { EcoPinSeverity } from "@/types/eco";
import { HttpSuccessResponseOptions } from "@/types/http-response";

type ClickedPin = {
    latlng: L.LatLng;
    insideGeoFence: boolean;
};

export const MapCore = () => {
    const { location, setActivePin, setPendingPin, ecoPins, setEcoPins } = useMap();
    const { openPanel, currentPanel } = useSidePanel();
    const [isLoadingGeoFence, setIsLoadingGeoFence] = React.useState(true);
    const [isLoadingEcoPins, setIsLoadingEcoPins] = React.useState(true);

    const [limaCallaoGeoFence, setLimaCallaoGeoFence] =
        React.useState<FeatureCollection | null>(null);
    const [clickedPin, setClickedPin] = React.useState<ClickedPin | null>(null);

    const mapRef = React.useRef<L.Map | null>(null);
    const [zoom, setZoom] = React.useState(10);
    const clickedPinTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        const fetchGeoFence = async () => {
            try {
                setIsLoadingGeoFence(true);
                const [limaRes, callaoRes] = await Promise.all([
                    fetch("/api/geo/provinces?code=1501&name=Lima&format=geojson"),
                    fetch("/api/geo/provinces?code=0701&name=Callao&format=geojson"),
                ]);

                if (!limaRes.ok || !callaoRes.ok) {
                    console.error("Failed to fetch Lima or Callao geodata.");
                    return;
                }

                const lima = (await limaRes.json()) as FeatureCollection;
                const callao = (await callaoRes.json()) as FeatureCollection;

                setLimaCallaoGeoFence({
                    type: "FeatureCollection",
                    features: [...lima.features, ...callao.features],
                });
            } catch (error) {
                console.error("GeoFence fetch error:", error);
            } finally {
                setIsLoadingGeoFence(false);
            }
        };

        fetchGeoFence();
    }, []);

    React.useEffect(() => {
        const fetchEcoPins = async () => {
            try {
                setIsLoadingEcoPins(true);
                const result = await fetch("/api/map/eco-pins");
                if (!result.ok) {
                    console.error("Failed to fetch ecos");
                    return;
                }
                const ecoPins =
                    await result.json<HttpSuccessResponseOptions<MapEcoPin[]>>();
                setEcoPins(ecoPins.data);
            } catch (error) {
                toast.error("Failed to fetch ecos");
                console.error("Failed to fetch ecos", error);
            } finally {
                setIsLoadingEcoPins(false);
            }
        };
        fetchEcoPins();
    }, [setEcoPins]);

    React.useEffect(() => {
        if (!currentPanel) {
            setPendingPin(null);
            setClickedPin(null);
        }
    }, [currentPanel, setPendingPin]);

    //function flyToOffset(
    //    map: L.Map,
    //    latlng: L.LatLngExpression,
    //    finalZoom = 17,
    //    offsetX = 300
    //) {
    //    const currentZoom = map.getZoom();
    //    const currentCenter = map.getCenter();
    //    const projectedCenter = map.project(currentCenter, currentZoom);
    //    const shiftedPoint = projectedCenter.add([offsetX, 0]);
    //    const shiftedLatLng = map.unproject(shiftedPoint, currentZoom);

    //    // Step 1: pan slightly to the right to make space for the panel
    //    map.flyTo(shiftedLatLng, currentZoom);

    //    // Step 2: after a delay, zoom in while keeping marker offset
    //    setTimeout(() => {
    //        const targetPoint = map.project(latlng, finalZoom);
    //        const offsetPoint = targetPoint.add([offsetX, 0]);
    //        const finalCenter = map.unproject(offsetPoint, finalZoom);

    //        map.flyTo(finalCenter, finalZoom);
    //    }, 800); // should match or slightly exceed duration of first flyTo
    //}

    function ZoomHandler() {
        const map = useLeafletMap();
        React.useEffect(() => {
            const handleZoom = () => setZoom(map.getZoom());
            map.on("zoomend", handleZoom);
            return () => {
                map.off("zoomend", handleZoom);
            };
        });
        return null;
    }

    function MapRefHandler() {
        const map = useLeafletMap();
        React.useEffect(() => {
            mapRef.current = map;

            const container = map.getContainer();
            container.style.cursor = "default";

            return () => {
                container.style.cursor = "";
            };
        }, [map]);
        return null;
    }

    function MapSearchHandler() {
        const map = useLeafletMap();
        React.useEffect(() => {
            if (location) {
                map.flyTo([location.lat, location.lng], 17);
            }
        }, [map]);
        return null;
    }

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                if (!limaCallaoGeoFence) return;
                if (getContainingFeature(e.latlng, limaCallaoGeoFence)) {
                    setClickedPin({
                        latlng: e.latlng,
                        insideGeoFence: true,
                    });
                    setPendingPin({
                        lat: e.latlng.lat,
                        lng: e.latlng.lng,
                    });
                    openPanel("newEcoPrompt");
                } else {
                    // If the user clicks outside geofence show it for feedback
                    // but take it away quickly and show an error toast
                    setClickedPin({
                        latlng: e.latlng,
                        insideGeoFence: false,
                    });

                    if (clickedPinTimeoutRef.current)
                        clearTimeout(clickedPinTimeoutRef.current);

                    toast.warning("Uy, muy lejos", {
                        description:
                            "Por ahora no puedes crear ecos fuera de Lima y Callao.",
                    });

                    clickedPinTimeoutRef.current = setTimeout(() => {
                        setClickedPin(null);
                    }, 2000);
                }
            },
        });
        return null;
    }

    return (
        <React.Fragment>
            <MapContainer
                center={[-12, -77.1]}
                zoom={10}
                className="absolute top-0 left-0 z-0 h-full w-full"
                zoomControl={false}
                preferCanvas
            >
                <TileLayer
                    //url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <ZoomHandler />
                <MapRefHandler />

                {clickedPin && (
                    <Marker
                        position={clickedPin.latlng}
                        icon={getPinIcon({ zoom, iconCallback: newEcoPinIcon })}
                    />
                )}
                {ecoPins &&
                    ecoPins.map((eco) => (
                        <Marker
                            key={eco.id}
                            position={{
                                lng: eco.location.coordinates[0],
                                lat: eco.location.coordinates[1],
                            }}
                            icon={getEcoPinIcon({
                                ecoSeverity: eco.severity as EcoPinSeverity,
                                zoom,
                                iconCallback: ecoPinIcon,
                            })}
                            eventHandlers={{
                                mouseover: () => {
                                    const map = mapRef.current;
                                    if (map) {
                                        map.getContainer().style.cursor = "pointer";
                                    }
                                },
                                mouseout: () => {
                                    const map = mapRef.current;
                                    if (map) {
                                        map.getContainer().style.cursor = "default";
                                    }
                                },
                                click: () => {
                                    setActivePin(eco);
                                    openPanel("ecoPin");
                                },
                            }}
                        />
                    ))}

                <MapSearchHandler />
                <MapClickHandler />
            </MapContainer>
            {isLoadingGeoFence && isLoadingEcoPins && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
                    <span className="text-xl font-bold text-white">Cargando...</span>
                </div>
            )}
        </React.Fragment>
    );
};
