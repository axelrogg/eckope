"use client";

import * as React from "react";
import { useMap } from "@/hooks";
import { AnimatePresence, motion } from "motion/react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { NominatimResult } from "@/types/nominatim";

export const NewEcoPrompt = () => {
    const {
        newEcoPinLocation,
        showNewEcoPinPrompt,
        setShowNewEcoPinPrompt,
        setShowNewEcoSidePanel,
    } = useMap();

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

        if (newEcoPinLocation) {
            fetchAddressFromCoordinates(newEcoPinLocation.lat, newEcoPinLocation.lng);
        }
    }, [newEcoPinLocation]);

    React.useEffect(() => {
        if (showNewEcoPinPrompt) {
            document.body.style.overflow = "hidden";
        }
    }, [showNewEcoPinPrompt]);

    return (
        <AnimatePresence>
            {newEcoPinLocation && showNewEcoPinPrompt && (
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
                                {locationResult?.display_name}
                            </CardDescription>
                            <CardAction>
                                <Button
                                    aria-label="Cerrar el panel de eco"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowNewEcoPinPrompt(false)}
                                >
                                    <X />
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="space-x-3">
                            <Button
                                onClick={() => {
                                    setShowNewEcoPinPrompt(false);
                                    setShowNewEcoSidePanel(true);
                                }}
                            >
                                Sí, reportar aquí
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setShowNewEcoPinPrompt(false)}
                            >
                                Cancelar
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
