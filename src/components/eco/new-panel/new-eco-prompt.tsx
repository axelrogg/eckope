"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Map, RotateCcw, X } from "lucide-react";

import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSidePanel } from "@/hooks/use-side-panel";
import { useMap } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchAddressFromCoordinates } from "@/lib/api/map";
import { NewEcoPinPromptSkeleton } from "./skeletons";

export const NewEcoPrompt = () => {
    const { pendingPin } = useMap();
    const { currentPanel, openPanel, closeAllPanels } = useSidePanel();

    const {
        data: locationResult,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["reverse-geocode", pendingPin?.lat, pendingPin?.lng],
        queryFn: () => fetchAddressFromCoordinates(pendingPin!.lat, pendingPin!.lng),
        enabled: !!pendingPin, // only run when we have a pin
        staleTime: 1000 * 60, // cache for 1 min
    });

    React.useEffect(() => {
        if (currentPanel === "newEcoPrompt") {
            document.body.style.overflow = "hidden";
        }
    }, [currentPanel]);

    return (
        <AnimatePresence>
            {pendingPin && currentPanel === "newEcoPrompt" && (
                <motion.div
                    className="absolute bottom-4 left-1/2 z-50 w-full -translate-x-1/2 p-2 lg:w-120"
                    role="dialog"
                    aria-modal="true"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <Card className="h-full w-full gap-3">
                        {isLoading && <NewEcoPinPromptSkeleton />}
                        {!isLoading && isError && (
                            <CardHeader className="grid-cols-2 space-y-3">
                                <div className="bg-destructive/50 flex flex-col items-center space-y-2 rounded-lg border p-3">
                                    <span className="text-sm">
                                        Uy, no pudimos encontrar esta dirección
                                    </span>
                                    <Button onClick={() => refetch()}>
                                        <RotateCcw />
                                        Reintentar
                                    </Button>
                                </div>
                                <CardAction>
                                    <Button
                                        aria-label="Cerrar el panel de eco"
                                        variant="ghost"
                                        size="sm"
                                        onClick={closeAllPanels}
                                    >
                                        <X />
                                    </Button>
                                </CardAction>
                            </CardHeader>
                        )}
                        {!isLoading && !isError && (
                            <React.Fragment>
                                <CardHeader>
                                    <CardTitle>
                                        ¿Quieres reportar un problema aquí?
                                    </CardTitle>
                                    <CardAction>
                                        <Button
                                            aria-label="Cerrar el panel de eco"
                                            variant="ghost"
                                            size="sm"
                                            onClick={closeAllPanels}
                                        >
                                            <X />
                                        </Button>
                                    </CardAction>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex flex-row gap-3">
                                        <div className="flex min-w-[20px] items-center justify-center">
                                            <Map
                                                size={24}
                                                className="text-muted-foreground"
                                            />
                                        </div>
                                        <span className="text-muted-foreground leading-snug break-words">
                                            {locationResult?.display_name}
                                        </span>
                                    </div>
                                    <div className="flex flex-row space-x-3">
                                        <Button onClick={() => openPanel("newEco")}>
                                            Sí, reportar aquí
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={closeAllPanels}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </CardContent>
                            </React.Fragment>
                        )}
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
