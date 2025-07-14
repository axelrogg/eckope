"use client";

import * as React from "react";
import { Button } from "../ui/button";

interface EcoContentProps {
    content: string;
    maxLines?: number;
}

export const EcoContent = ({ content, maxLines = 6 }: EcoContentProps) => {
    const [expanded, setExpanded] = React.useState(false);
    const [isTruncated, setIsTruncated] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const hasOverflow = element.scrollHeight > element.clientHeight;
        setIsTruncated(hasOverflow);
    }, [content]);

    return (
        <div className="space-y-1">
            <div
                ref={contentRef}
                className={`text-sm ${!expanded ? `line-clamp-${maxLines}` : ""}`}
            >
                {content}
            </div>

            {isTruncated && (
                <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    {expanded ? "Ver menos" : "Ver más"}
                </Button>
            )}
        </div>
    );
};
