import { MapClient, MapProvider } from "@/components/map";
import { MapToolBar } from "@/components/map/tool-bar/map-tool-bar";
import { EcoPinPanel } from "@/components/eco/eco-panel";
import { MapNote } from "./map-note";
import { NewEcoPrompt } from "@/components/eco/new-eco-prompt";
import { NewEcoSidePanel } from "@/components/eco/new-eco-side-panel";

export default function Home() {
    return (
        <MapProvider>
            <MapNote />
            <MapToolBar />
            <MapClient />
            <EcoPinPanel />
            <NewEcoSidePanel />
            <NewEcoPrompt />
        </MapProvider>
    );
}
