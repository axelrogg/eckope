import { MapClient, MapProvider } from "@/components/map";
import { MapToolBar } from "@/components/map/tool-bar/map-tool-bar";
import { EcoPinPanel } from "@/components/eco/eco-panel";
import { MapNote } from "./map-note";
import { NewEcoPrompt } from "@/components/eco/new-eco-prompt";

export default function Home() {
    return (
        <MapProvider>
            <MapNote />
            <MapToolBar />
            <MapClient />
            <EcoPinPanel />
            <NewEcoPrompt />
        </MapProvider>
    );
}
