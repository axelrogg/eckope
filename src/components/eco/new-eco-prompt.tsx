"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Map, X } from "lucide-react";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSidePanel } from "@/hooks/use-side-panel";
import { useMap } from "@/hooks";
import { NominatimResult } from "@/types/nominatim";

export const NewEcoPrompt = () => {
    const { pendingPin } = useMap();
    const { currentPanel, openPanel, closeAllPanels } = useSidePanel();
    const [locationResult, setLocationResult] = React.useState<NominatimResult | null>(
        null
    );

    React.useEffect(() => {
        const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
            const result = await fetch(
                `${process.env.NEXT_PUBLIC_NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            if (!result.ok) {
                console.error("not okay");
                return;
            }
            const body = (await result.json()) as NominatimResult;
            console.log(body);
            setLocationResult(body);
        };

        if (pendingPin) {
            fetchAddressFromCoordinates(pendingPin.lat, pendingPin.lng);
        }
    }, [pendingPin]);

    React.useEffect(() => {
        if (currentPanel === "newEcoPrompt") {
            document.body.style.overflow = "hidden";
        }
    }, [currentPanel]);

    return (
        <AnimatePresence>
            {pendingPin && currentPanel === "newEcoPrompt" && (
                <motion.div
                    className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 p-2 lg:w-120"
                    role="dialog"
                    aria-modal="true"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <Card className="h-full w-full">
                        <CardHeader>
                            <CardTitle>¿Quieres reportar un problema aquí?</CardTitle>
                            <CardDescription>
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
                            </CardDescription>
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
                        <CardContent className="space-x-3">
                            <Button onClick={() => openPanel("newEco")}>
                                Sí, reportar aquí
                            </Button>
                            <Button variant="destructive" onClick={closeAllPanels}>
                                Cancelar
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
