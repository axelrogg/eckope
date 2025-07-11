"use client";

import React from "react";

import { cn } from "@/lib/utils/cn";
import { useSidebar } from "./sidebar";

export const PageDiv = ({
    children,
    className,
    ...props
}: React.ComponentProps<"div">) => {
    const { open } = useSidebar();

    return (
        <div
            className={cn(
                "transition-[width,margin] duration-200 ease-linear",
                open ? "w-[calc(84vw)]" : "w-[calc(90vw)]"
            )}
        >
            <div
                className={cn(
                    "mx-auto max-w-[90vw] px-4 pt-10 sm:max-w-[600px] sm:px-6 md:max-w-[720px]",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    );
};
