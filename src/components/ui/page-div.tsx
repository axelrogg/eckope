import React from "react";

import { cn } from "@/lib/utils/cn";

export const PageDiv = ({
    children,
    className,
    ...props
}: React.ComponentProps<"div">) => {
    return (
        <div className="w-[calc(100vw)] transition-[width,margin] duration-200 ease-linear">
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
