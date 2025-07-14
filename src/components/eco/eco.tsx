"use client";

import * as React from "react";
import { EcoReply as EcoReplyType, Eco as EcoType } from "@/types/eco";
import { EcoAuthor } from "./eco-author";
import { EcoControls } from "./eco-controls";
import { EcoContent } from "./eco-content";

type EcoProps = Omit<EcoType, "id" | "edited" | "ecoPinId" | "editedAt">;

export const Eco = ({
    author,
    content,
    createdAt,
    upvotes,
    downvotes,
    replies,
}: EcoProps) => {
    const repliesContainerRef = React.useRef<HTMLDivElement>(null);
    const [railHeight, setRailHeight] = React.useState<number>(0);

    React.useEffect(() => {
        if (!repliesContainerRef.current || replies.length === 0) return;

        const container = repliesContainerRef.current;

        const updateRailHeight = () => {
            const lastReply = container.children[container.children.length - 1];
            if (!lastReply) return;

            requestAnimationFrame(() => {
                const containerTop = container.getBoundingClientRect().top;
                const lastReplyBottom = lastReply.getBoundingClientRect().bottom;
                const newHeight = lastReplyBottom - containerTop - 20;
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
    }, [replies]);

    return (
        <div className="group relative flex flex-col space-y-2">
            <EcoAuthor author={author} createdAt={createdAt} />

            {replies.length > 0 && (
                <div
                    className="group bg-muted group-hover:bg-accent absolute top-12 left-4 w-px transition-colors duration-300 ease-out"
                    style={{ height: `${railHeight}px` }}
                />
            )}

            <div className="ml-10 space-y-2">
                <EcoContent content={content} />
                <EcoControls upvotes={upvotes} downvotes={downvotes} />
            </div>
            <div ref={repliesContainerRef}>
                {replies.map((reply) => (
                    <EcoReply
                        author={reply.author}
                        content={reply.content}
                        upvotes={upvotes}
                        downvotes={downvotes}
                        editedAt={reply.editedAt}
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

const EcoReply = ({ author, content, upvotes, downvotes, createdAt }: EcoReplyType) => (
    <div className="relative my-3 ml-15 flex flex-col space-y-2">
        <div className="border-muted group-hover:border-accent absolute -top-14 -left-11 h-20 w-8 rounded-bl-xl border-b border-l transition-colors duration-300" />
        <EcoAuthor author={author} createdAt={createdAt} />
        <div className="ml-10">
            <EcoContent content={content} />
            <EcoControls upvotes={upvotes} downvotes={downvotes} showEcoButton={false} />
        </div>
    </div>
);
