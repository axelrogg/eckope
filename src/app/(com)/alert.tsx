"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ALERT_COOKIE_NAME = "show_alert";

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

export const Alert = () => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const show = clientCookies.get(ALERT_COOKIE_NAME);
        if (show !== "false") {
            setShowAlert(true);
        }
    }, []);

    function onClickDoNotShowAgain() {
        clientCookies.set(ALERT_COOKIE_NAME, "false", 7);
        setShowAlert(false);
    }

    return (
        <AnimatePresence>
            {showAlert && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-1/3 left-2 z-[99] w-[calc(100vw-1rem)] md:left-1/4 md:w-1/2"
                >
                    <AlertDialog open={showAlert}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Búsqueda de lugares limitada a Lima y Callao
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Por ahora, Éckope se enfoca exclusivamente en las
                                    provincias de Lima y Callao.
                                    <br />
                                    Nos expandiremos tan pronto como podamos.
                                    <br />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setShowAlert(false)}>
                                    Cerrar
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={onClickDoNotShowAgain}>
                                    No mostrar de nuevo
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
