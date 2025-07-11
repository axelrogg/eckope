"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    TileLayer,
    GeoJSON,
    useMap as useLeafletMap,
    useMapEvents,
} from "react-leaflet";

import { useMap } from "@/hooks";

const GEOJSON_URL = "/data/peru.geo.json";

export const MapCore = () => {
    const { location } = useMap();
    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(
        null
    );

    useEffect(() => {
        const fetchPeruMap = async () => {
            try {
                const mapResponse = await fetch(GEOJSON_URL);
                if (!mapResponse.ok) {
                    console.error("map wasnt fetched");
                    return;
                }
                setGeoJsonData(await mapResponse.json());
            } catch (error) {
                console.error(error);
            }
        };
        fetchPeruMap();
    }, []);

    function MapSearchHandler() {
        const map = useLeafletMap();

        useEffect(() => {
            if (location) {
                map.flyTo([location.lat, location.lng], 17);
            }
        }, [location, map]);
        return null;
    }

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                console.log("Map clicked at:", lat, lng);
            },
        });
        return null;
    }

    return (
        <MapContainer
            center={[-9.2, -75]}
            zoom={5}
            className="absolute top-0 left-0 z-0 h-[100svh] w-screen"
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <MapSearchHandler />
            <MapClickHandler />
            {geoJsonData && <GeoJSON data={geoJsonData} />}
        </MapContainer>
    );
};
