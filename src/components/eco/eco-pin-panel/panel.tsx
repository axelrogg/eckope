"use client";

import { useQuery } from "@tanstack/react-query";

import {
    SidePanel,
    SidePanelContent,
    SidePanelDescription,
    SidePanelHeader,
    SidePanelTitle,
} from "@/components/side-panel/side-panel";
import { useSidePanel } from "@/hooks/use-side-panel";
import { useMap } from "@/hooks";
import { User } from "@/types/auth";
import { fetchEcoPinById } from "@/lib/api/eco-pins";
import { EcoAuthor } from "@/components/eco/eco-pin-panel/eco-author";
import { EcoPinPanelCloseButton } from "./close-button";
import { EcoPinPanelPinContentSkeleton, EcoPinPanelHeaderSkeleton } from "./skeletons";
import { EcoContent } from "@/components/eco/eco-pin-panel/eco-content";
import { EcoPinControls } from "@/components/eco/eco-pin-panel/controls/eco-pin-controls";
import { EcoPinPanelEcoList } from "@/components/eco/eco-pin-panel/eco-list";
import { EcoPinPanelNewEcoForm } from "./new-eco-form";
import { Button } from "@/components/ui/button";

interface EcoPinPanelProps {
    user: User | null;
}

export const EcoPinPanel = ({ user }: EcoPinPanelProps) => {
    const { activePin } = useMap();
    const { isPanelOpen, closeAllPanels } = useSidePanel();
    const { data: ecoPin, isLoading: ecoPinLoading } = useQuery({
        queryKey: ["eco-pin", activePin?.id],
        queryFn: () => fetchEcoPinById(activePin!.id),
        enabled: !!activePin?.id,
    });

    if (!activePin) {
        return null;
    }

    return (
        <SidePanel show={activePin && isPanelOpen("ecoPin")}>
            {ecoPinLoading || !ecoPin ? (
                <EcoPinPanelHeaderSkeleton onClose={closeAllPanels} />
            ) : (
                <SidePanelHeader>
                    <SidePanelTitle className="text-xl">{ecoPin.title}</SidePanelTitle>
                    <SidePanelDescription>
                        <EcoAuthor
                            author={ecoPin.author}
                            createdAt={
                                ecoPin.edited
                                    ? new Date(activePin.updatedAt)
                                    : new Date(activePin.createdAt)
                            }
                        />
                    </SidePanelDescription>

                    <EcoPinPanelCloseButton onClose={closeAllPanels} />
                </SidePanelHeader>
            )}
            <SidePanelContent className="space-y-7 text-sm">
                {ecoPinLoading || !ecoPin ? (
                    <EcoPinPanelPinContentSkeleton />
                ) : (
                    <div className="space-y-3">
                        <EcoContent content={ecoPin.content} maxLines={15} />
                        <EcoPinControls id={ecoPin.id} user={user} />
                        {user ? (
                            <EcoPinPanelNewEcoForm user={user} ecoPinId={activePin.id} />
                        ) : (
                            <Button variant="destructive" className="w-full">
                                Inicia sesión
                            </Button>
                        )}
                    </div>
                )}
                <EcoPinPanelEcoList ecoPinId={activePin.id} user={user} />
            </SidePanelContent>
        </SidePanel>
    );
};
