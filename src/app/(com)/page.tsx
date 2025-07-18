import { MapClient, MapProvider } from "@/components/map";
import { MapToolBar } from "@/components/map/map-tool-bar";
import { EcoPinPanel } from "@/components/eco/eco-panel";
import { MapNote } from "./map-note";

export default function Home() {
    return (
        <MapProvider>
            <MapNote />
            <MapToolBar />
            <MapClient />
            <EcoPinPanel />
        </MapProvider>
    );
}
