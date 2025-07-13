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
import { EcoReply } from "./eco-reply";
import { EcoAuthor } from "./eco-author";

interface EcoPanelProps {
    eco: EcoParent;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EcoPanel = ({ eco, open, setOpen }: EcoPanelProps) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="absolute top-0 right-0 z-50 h-svh w-100 bg-transparent p-2"
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
                                <CardTitle>{eco.title}</CardTitle>
                                <CardDescription className="flex flex-col space-y-2">
                                    <EcoAuthor
                                        username={eco.author.handle}
                                        fullName={eco.author.fullName}
                                    />
                                    <Badge variant="default">En revisión</Badge>
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
                            <CardContent className="space-y-3 text-sm">
                                <div>{eco.content}</div>
                                <EcoControls
                                    upvotes={20}
                                    downvotes={20}
                                    showEcoButton={false}
                                />
                                <EcoPanelReplyForm />
                                <React.Fragment>
                                    {eco.replies.length > 0 &&
                                        eco.replies.map((reply, i) => (
                                            <React.Fragment key={i}>
                                                <EcoReply
                                                    id={reply.id}
                                                    upvotes={reply.upvotes}
                                                    downvotes={reply.downvotes}
                                                    content={reply.content}
                                                    type="reply"
                                                    author={reply.author}
                                                    parentId={reply.parentId}
                                                />
                                                {i < eco.replies.length - 1 && (
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
