"use client";

import { useSidePanel } from "@/hooks";
import { SidePanelAction, SidePanelHeader } from "../../side-panel/side-panel";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import { X } from "lucide-react";
import React from "react";
import { CardHeader } from "../../ui/card";

export const NewEcoPinPanelHeaderSkeleton = () => {
    const { closeAllPanels } = useSidePanel();

    return (
        <SidePanelHeader>
            <Skeleton className="h-[26px] w-full" />
            <div className="text-muted-foreground my-2 items-center gap-3 rounded-lg border p-3 text-sm">
                <div className="group flex flex-row gap-3 text-sm">
                    <div className="flex min-w-[24px] items-center justify-center">
                        <Skeleton className="h-[24px] w-[24px]" />
                    </div>
                    <div className="flex w-full flex-col space-y-2">
                        <Skeleton className="h-[16px] w-full" />
                        <Skeleton className="h-[16px] w-full" />
                    </div>
                </div>
            </div>
            <Skeleton className="h-[40px] w-full" />
            <SidePanelAction>
                <Button
                    aria-label="Cerrar formulario"
                    variant="ghost"
                    size="sm"
                    onClick={() => closeAllPanels()}
                >
                    <X />
                </Button>
            </SidePanelAction>
        </SidePanelHeader>
    );
};

export const NewEcoPinPromptSkeleton = () => {
    const { closeAllPanels } = useSidePanel();
    return (
        <CardHeader className="space-y-2">
            <Skeleton className="h-[26px] w-full" />
            <div className="group flex flex-row gap-3 text-sm">
                <div className="flex min-w-[24px] items-center justify-center">
                    <Skeleton className="h-[24px] w-[24px]" />
                </div>
                <div className="flex w-full flex-col space-y-2">
                    <Skeleton className="h-[16px] w-full" />
                    <Skeleton className="h-[16px] w-full" />
                </div>
            </div>

            <div className="flex flex-row space-x-3">
                <Skeleton className="h-[36px] w-[140px]" />
                <Skeleton className="h-[36px] w-[90px]" />
            </div>
            <SidePanelAction>
                <Button
                    aria-label="Cerrar formulario"
                    variant="ghost"
                    size="sm"
                    onClick={() => closeAllPanels()}
                >
                    <X />
                </Button>
            </SidePanelAction>
        </CardHeader>
    );
};
