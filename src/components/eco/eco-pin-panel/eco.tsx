"use client";

import * as React from "react";
import { Eco as EcoType } from "@/types/eco";
import { EcoContent } from "./eco-content";
import { Badge } from "@/components/ui/badge";
import { EcoAuthor } from "@/components/eco/eco-pin-panel/eco-author";
import { EcoControls } from "./controls/eco-controls";
import { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEcoRepliesByEcoId } from "@/lib/api/ecos";
import { EcoPinPanelEcoReply } from "./eco-reply";
import { cn } from "@/lib/utils/cn";

type EcoProps = Omit<EcoType, "ecoPinId" | "editedAt" | "upvotes" | "downvotes"> & {
    user: User | null;
};

export const EcoPinPanelEco = ({
    id,
    user,
    author,
    content,
    createdAt,
    edited,
    updatedAt,
    replyCount,
}: EcoProps) => {
    const repliesContainerRef = React.useRef<HTMLDivElement>(null);
    const [railHeight, setRailHeight] = React.useState<number>(0);
    const [replyFormOpen, setReplyFormOpen] = React.useState(false);
    const [showReplies, setShowReplies] = React.useState(false);

    const { data: replies = [], isLoading: repliesLoading } = useQuery({
        queryKey: ["eco-reply-list", id],
        queryFn: () => fetchEcoRepliesByEcoId(id),
        enabled: showReplies === true,
    });

    React.useEffect(() => {
        if (!repliesContainerRef.current || replies.length === 0) return;

        const container = repliesContainerRef.current;

        const updateRailHeight = () => {
            const lastReply = container.children[container.children.length - 1];
            if (!lastReply) return;

            requestAnimationFrame(() => {
                const containerTop = container.getBoundingClientRect().top;
                const lastReplyBottom = lastReply.getBoundingClientRect().bottom;
                const increment = replyFormOpen ? 20 : 0; // This is the increment that we have to add in case the reply form is shown on the screen
                const newHeight = lastReplyBottom - containerTop - 20 + increment;
                setRailHeight(newHeight);
            });
        };

        updateRailHeight(); // Initial run

        const observer = new ResizeObserver(updateRailHeight);

        observer.observe(container);
        const lastChild = container.children[container.children.length - 1];
        if (lastChild) observer.observe(lastChild);

        return () => {
            observer.disconnect();
        };
    }, [replies, replyFormOpen]);

    return (
        <div className="group relative flex flex-col space-y-2">
            <EcoAuthor
                author={author}
                createdAt={edited ? new Date(updatedAt) : new Date(createdAt)}
            />
            {edited && <Badge className="ml-10">Editado</Badge>}

            {showReplies && replies.length > 0 && (
                <div
                    className="group bg-muted group-hover:bg-accent absolute top-11 left-5 w-px transition-colors duration-300 ease-out"
                    style={{ height: `${railHeight}px` }}
                />
            )}
            <div className="ml-10 space-y-2">
                <EcoContent content={content} />
                <EcoControls id={id} user={user} onReplyFormToggle={setReplyFormOpen} />

                {replyCount > 0 && (
                    <Button
                        variant="ghost"
                        onClick={() => setShowReplies(!showReplies)}
                        className={cn(
                            "group/replies",
                            showReplies ? "text-background bg-accent" : "text-foreground"
                        )}
                    >
                        {showReplies === true ? (
                            <ChevronUp className="group/replies" />
                        ) : (
                            <ChevronDown className="group/replies" />
                        )}
                        {replyCount === 1
                            ? "Ver 1 respuesta"
                            : `Ver las ${replyCount} repuestas`}
                    </Button>
                )}
            </div>
            {repliesLoading && (
                <div className="my-2 flex w-full items-center justify-center">
                    <LoaderCircle className="animate-spin" />
                </div>
            )}

            <div ref={repliesContainerRef}>
                {showReplies &&
                    replies.map((reply) => (
                        <EcoPinPanelEcoReply
                            user={user}
                            author={reply.author}
                            content={reply.content}
                            updatedAt={reply.updatedAt}
                            createdAt={reply.createdAt}
                            edited={reply.edited}
                            id={reply.id}
                            ecoId={reply.ecoId}
                            key={reply.id}
                        />
                    ))}
            </div>
        </div>
    );
};
