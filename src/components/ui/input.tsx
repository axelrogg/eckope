import { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

function Input({ className, type, ...props }: ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "bg-foreground text-primary-foreground flex h-9 w-full min-w-0 rounded-md px-3 py-1 shadow-xs",
                /* File related classes */
                "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                /* Placeholder and selection */
                "placeholder:text-muted selection:bg-accent selection:text-primary-foreground",
                "transition-[color,box-shadow] outline-none md:text-sm",
                /* Disabled */
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                /* Aria invalid */
                "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    );
}

export { Input };
