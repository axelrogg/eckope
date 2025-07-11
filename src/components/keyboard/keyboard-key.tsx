import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

export const KeyboardKey = ({
    className,
    children,
    ...props
}: React.ComponentProps<"kbd">) => (
    <Badge variant="secondary" className="bg-accent text-primary-foreground">
        <kbd className={cn("pointer-events-none select-none", className)} {...props}>
            {children}
        </kbd>
    </Badge>
);
