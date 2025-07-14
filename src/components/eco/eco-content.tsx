"use client";

import * as React from "react";
import { Button } from "../ui/button";

const clampClasses: Record<number, string> = {
    1: "line-clamp-1",
    2: "line-clamp-2",
    3: "line-clamp-3",
    4: "line-clamp-4",
    5: "line-clamp-5",
    6: "line-clamp-6",
    7: "line-clamp-7",
    8: "line-clamp-8",
    9: "line-clamp-9",
    10: "line-clamp-10",
    11: "line-clamp-11",
    12: "line-clamp-12",
    13: "line-clamp-13",
    14: "line-clamp-14",
    15: "line-clamp-15",
};

interface EcoContentProps {
    content: string;
    maxLines?: number;
}

export const EcoContent = ({ content, maxLines = 6 }: EcoContentProps) => {
    const [expanded, setExpanded] = React.useState(false);
    const [isTruncated, setIsTruncated] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const clampClass = !expanded ? clampClasses[maxLines] : "";

    React.useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const hasOverflow = element.scrollHeight > element.clientHeight;
        setIsTruncated(hasOverflow);
    }, [content]);

    return (
        <div className="space-y-1">
            <div ref={contentRef} className={`text-sm ${clampClass}`}>
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
