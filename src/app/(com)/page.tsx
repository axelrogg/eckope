import { MapClient, MapProvider } from "@/components/map";
import { MapToolBar } from "@/components/map/tool-bar/map-tool-bar";
import { EcoPinPanel } from "@/components/eco/eco-panel";
import { MapNote } from "./map-note";
import { NewEcoPrompt } from "@/components/eco/new-eco-prompt";
import { NewEcoSidePanel } from "@/components/eco/new-eco-side-panel";
import { SidePanelProvider } from "@/components/side-panel/side-panel-provider";
import { MapGeoFilterProvider } from "@/components/map/tool-bar/geo-filter/geo-filter-provider";

export default function Home() {
    return (
        <MapProvider>
            <MapGeoFilterProvider>
                <SidePanelProvider>
                    <MapNote />
                    <MapToolBar />
                    <MapClient />
                    <EcoPinPanel />
                    <NewEcoSidePanel />
                    <NewEcoPrompt />
                </SidePanelProvider>
            </MapGeoFilterProvider>
        </MapProvider>
    );
}
