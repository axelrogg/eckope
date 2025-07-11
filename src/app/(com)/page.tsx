import { MapClient, MapProvider, MapSearchBar } from "@/components/map";

export default function Home() {
    return (
        <MapProvider>
            <MapSearchBar />
            <MapClient />
        </MapProvider>
    );
}
