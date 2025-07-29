"use client";

import * as React from "react";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { EcoControls } from "./eco-controls";
import { EcoPanelReplyForm } from "./eco-panel-form";
import { Eco } from "./eco";
import { EcoAuthor } from "./eco-author";
import { EcoContent } from "./eco-content";
import { useMap } from "@/hooks";

export const EcoPinPanel = () => {
    const { selectedEcoPin, showEcoPinPanel, setShowEcoPinPanel } = useMap();

    React.useEffect(() => {
        if (showEcoPinPanel) {
            document.body.style.overflow = "hidden";
        }
    }, [showEcoPinPanel]);

    const handleAnimationComplete = () => {
        if (!showEcoPinPanel) {
            document.body.style.overflow = "";
        }
    };

    return (
        <AnimatePresence>
            {selectedEcoPin && showEcoPinPanel && (
                <motion.div
                    className="absolute top-0 right-0 z-50 h-svh bg-transparent p-2 lg:w-120"
                    role="dialog"
                    aria-modal="true"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onAnimationComplete={handleAnimationComplete}
                >
                    <ScrollArea className="h-full rounded-xl">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    {selectedEcoPin.title}
                                </CardTitle>
                                <CardDescription className="flex flex-col space-y-2">
                                    <EcoAuthor
                                        author={selectedEcoPin.author}
                                        createdAt={selectedEcoPin.createdAt}
                                    />
                                    <Badge variant="secondary">En revisión</Badge>
                                </CardDescription>
                                <CardAction>
                                    <Button
                                        aria-label="Cerrar el panel de eco"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowEcoPinPanel(false)}
                                    >
                                        <X />
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent className="space-y-7 text-sm">
                                <div className="space-y-3">
                                    <EcoContent
                                        content={selectedEcoPin.content}
                                        maxLines={15}
                                    />
                                    <EcoControls
                                        upvotes={20}
                                        downvotes={20}
                                        showEcoButton={false}
                                    />
                                    <EcoPanelReplyForm />
                                </div>
                                <React.Fragment>
                                    {selectedEcoPin.ecos.map((eco, i) => (
                                        <React.Fragment key={i}>
                                            <Eco
                                                replies={eco.replies}
                                                upvotes={eco.upvotes}
                                                downvotes={eco.downvotes}
                                                content={eco.content}
                                                author={eco.author}
                                                createdAt={eco.createdAt}
                                            />
                                            {i < selectedEcoPin.ecos.length - 1 && (
                                                <Separator className="my-2" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            </CardContent>
                        </Card>
                    </ScrollArea>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
