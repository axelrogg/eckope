"use client";

import * as React from "react";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { EcoPin } from "@/types/eco";
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

interface EcoPanelProps {
    ecoPin: EcoPin;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EcoPinPanel = ({ ecoPin, open, setOpen }: EcoPanelProps) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="absolute top-0 right-0 z-50 h-svh w-120 bg-transparent p-2"
                    role="dialog"
                    aria-modal="true"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <ScrollArea className="h-full rounded-xl">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-xl">{ecoPin.title}</CardTitle>
                                <CardDescription className="flex flex-col space-y-2">
                                    <EcoAuthor
                                        author={ecoPin.author}
                                        createdAt={ecoPin.createdAt}
                                    />
                                    <Badge variant="secondary">En revisión</Badge>
                                </CardDescription>
                                <CardAction>
                                    <Button
                                        aria-label="Cerrar el panel de eco"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        <X />
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent className="space-y-7 text-sm">
                                <div className="space-y-3">
                                    <EcoContent content={ecoPin.content} />
                                    <EcoControls
                                        upvotes={20}
                                        downvotes={20}
                                        showEcoButton={false}
                                    />
                                    <EcoPanelReplyForm />
                                </div>
                                <React.Fragment>
                                    {ecoPin.ecos.length > 0 &&
                                        ecoPin.ecos.map((eco, i) => (
                                            <React.Fragment key={i}>
                                                <Eco
                                                    replies={eco.replies}
                                                    upvotes={eco.upvotes}
                                                    downvotes={eco.downvotes}
                                                    content={eco.content}
                                                    author={eco.author}
                                                    createdAt={eco.createdAt}
                                                />
                                                {i < ecoPin.ecos.length - 1 && (
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
