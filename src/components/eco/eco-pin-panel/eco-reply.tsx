"use client";

import { EcoReply } from "@/types/eco";
import { EcoAuthor } from "./eco-author";
import { EcoContent } from "./eco-content";
import { EcoReplyControls } from "./controls/eco-reply-controls";

export const EcoPinPanelEcoReply = ({
    id,
    author,
    content,
    createdAt,
}: Omit<EcoReply, "upvotes" | "downvotes">) => {
    return (
        <div className="relative my-3 ml-10 flex flex-col space-y-2">
            <div className="border-muted group-hover:border-accent absolute -top-14 -left-5 h-20 w-4 rounded-bl-lg border-b border-l transition-colors duration-300" />
            <EcoAuthor author={author} createdAt={new Date(createdAt)} />
            <div className="ml-10 space-y-2">
                <EcoContent content={content} />
                <EcoReplyControls id={id} />
            </div>
        </div>
    );
};
