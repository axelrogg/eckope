import { auth } from "@/auth";

import { MapClient, MapProvider } from "@/components/map";
//import { MapToolBar } from "@/components/map/tool-bar/map-tool-bar";
import { EcoPinPanel } from "@/components/eco/eco-pin-panel/panel";
import { MapNote } from "./map-note";
import { NewEcoPrompt } from "@/components/eco/new-eco-prompt";
import { NewEcoSidePanel } from "@/components/eco/new-eco-side-panel";
import { SidePanelProvider } from "@/components/side-panel/side-panel-provider";
//import { MapGeoFilterProvider } from "@/components/map";

export default async function Home() {
    const session = await auth();

    if (!session || !session.user) {
        return null;
    }

    return (
        <MapProvider>
            {/*<MapGeoFilterProvider>  */}
            <SidePanelProvider>
                <MapNote />
                {/*
                    <MapToolBar />
                    */}
                <MapClient />
                <EcoPinPanel user={session.user} />
                <NewEcoSidePanel user={session.user} />
                <NewEcoPrompt />
            </SidePanelProvider>
            {/*</MapGeoFilterProvider> */}
        </MapProvider>
    );
}
