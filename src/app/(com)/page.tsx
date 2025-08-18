import { auth } from "@/auth";

import { MapClient, MapProvider } from "@/components/map";
//import { MapToolBar } from "@/components/map/tool-bar/map-tool-bar";
import { EcoPinPanel } from "@/components/eco/eco-pin-panel/panel";
import { Alert } from "./alert";
import { NewEcoPrompt } from "@/components/eco/new-panel/new-eco-prompt";
import { NewEcoSidePanel } from "@/components/eco/new-panel/new-eco-side-panel";
import { SidePanelProvider } from "@/components/side-panel/side-panel-provider";
//import { MapGeoFilterProvider } from "@/components/map";

export default async function Home() {
    const session = await auth();
    const user = session ? session.user : null;

    return (
        <MapProvider>
            {/*<MapGeoFilterProvider>  */}
            <SidePanelProvider>
                <Alert />
                {/*
                    <MapToolBar />
                    */}
                <MapClient />
                <EcoPinPanel user={user} />
                <NewEcoSidePanel user={user} />
                <NewEcoPrompt />
            </SidePanelProvider>
            {/*</MapGeoFilterProvider> */}
        </MapProvider>
    );
}
