"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const MAPNOTE_COOKIE_NAME = "show_map_note";

const clientCookies = {
    get(key: string): string | null {
        return (
            document.cookie
                .split("; ")
                .find((row) => row.startsWith(key + "="))
                ?.split("=")[1] || null
        );
    },
    set(key: string, val: string, days: number) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${key}=${val}; expires=${expires}; path=/`;
    },
};

export const MapNote = () => {
    const [showMapNote, setShowMapNote] = useState(false);

    useEffect(() => {
        const show = clientCookies.get(MAPNOTE_COOKIE_NAME);
        if (show !== "false") {
            setShowMapNote(true);
        }
    }, []);

    function onClickDoNotShowAgain() {
        clientCookies.set(MAPNOTE_COOKIE_NAME, "false", 7);
        setShowMapNote(false);
    }

    return (
        <AnimatePresence>
            {showMapNote && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-2 left-1/4 z-[99] w-1/2"
                >
                    <Card className="bg-background">
                        <CardHeader>
                            <CardTitle>
                                Búsqueda de lugares limitada a Lima y Callao
                            </CardTitle>
                            <CardAction>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowMapNote(false)}
                                >
                                    <X />
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            La versión actual de Éckope se enfoca exclusivamente en las
                            provincias de Lima y Callao.
                            <br />
                            Nos expandiremos tan pronto como podamos.
                            <br />
                            <Button
                                variant="link"
                                onClick={onClickDoNotShowAgain}
                                className="pl-0"
                            >
                                No mostrar de nuevo
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
