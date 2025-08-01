"use client";

import * as React from "react";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    SidePanel,
    SidePanelAction,
    SidePanelContent,
    SidePanelDescription,
    SidePanelHeader,
    SidePanelTitle,
} from "@/components/side-panel/side-panel";
import { EcoControls } from "./eco-controls";
import { EcoPanelReplyForm } from "./eco-panel-form";
import { Eco } from "./eco";
import { EcoAuthor } from "./eco-author";
import { EcoContent } from "./eco-content";
import { useMap } from "@/hooks";
import { useSidePanel } from "@/hooks/use-side-panel";

export const EcoPinPanel = () => {
    const { activePin } = useMap();
    const { isPanelOpen, closeAllPanels } = useSidePanel();

    if (!activePin) {
        return null;
    }

    return (
        <SidePanel show={activePin && isPanelOpen("ecoPin")}>
            <SidePanelHeader>
                <SidePanelTitle className="text-xl">{activePin.title}</SidePanelTitle>
                <SidePanelDescription className="flex flex-col space-y-2">
                    <EcoAuthor
                        author={activePin.author}
                        createdAt={activePin.createdAt}
                    />
                    <Badge variant="secondary">En revisión</Badge>
                </SidePanelDescription>
                <SidePanelAction>
                    <Button
                        aria-label="Cerrar el panel de eco"
                        variant="ghost"
                        size="sm"
                        onClick={closeAllPanels}
                    >
                        <X />
                    </Button>
                </SidePanelAction>
            </SidePanelHeader>
            <SidePanelContent className="space-y-7 text-sm">
                <div className="space-y-3">
                    <EcoContent content={activePin.content} maxLines={15} />
                    <EcoControls upvotes={20} downvotes={20} showEcoButton={false} />
                    <EcoPanelReplyForm />
                </div>
                <React.Fragment>
                    {activePin.ecos.map((eco, i) => (
                        <React.Fragment key={i}>
                            <Eco
                                replies={eco.replies}
                                upvotes={eco.upvotes}
                                downvotes={eco.downvotes}
                                content={eco.content}
                                author={eco.author}
                                createdAt={eco.createdAt}
                            />
                            {i < activePin.ecos.length - 1 && (
                                <Separator className="my-2" />
                            )}
                        </React.Fragment>
                    ))}
                </React.Fragment>
            </SidePanelContent>
        </SidePanel>
    );
};
