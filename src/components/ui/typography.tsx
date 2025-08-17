import { cn } from "@/lib/utils/cn";

const TypographyH1 = ({ className, children, ...props }: React.ComponentProps<"h1">) => (
    <h1
        className={cn(
            "mb-10 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
            className
        )}
        {...props}
    >
        {children}
    </h1>
);

const TypographyH2 = ({ className, children, ...props }: React.ComponentProps<"h2">) => (
    <h2
        className={cn(
            "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 [&:not(:first-child)]:mt-6",
            className
        )}
        {...props}
    >
        {children}
    </h2>
);

const TypographyH3 = ({ className, children, ...props }: React.ComponentProps<"h3">) => (
    <h2
        className={cn(
            "mt-4 scroll-m-20 text-2xl font-semibold tracking-tight",
            className
        )}
        {...props}
    >
        {children}
    </h2>
);

const TypographyH4 = ({ className, children, ...props }: React.ComponentProps<"h4">) => (
    <h2
        className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}
        {...props}
    >
        {children}
    </h2>
);

const TypographyP = ({ className, children, ...props }: React.ComponentProps<"p">) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-2", className)} {...props}>
        {children}
    </p>
);

const TypographyBlockquote = ({
    className,
    children,
    ...props
}: React.ComponentProps<"blockquote">) => (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props}>
        {children}
    </blockquote>
);

const TypographyInlineCode = ({
    className,
    children,
    ...props
}: React.ComponentProps<"code">) => (
    <code
        className={cn(
            "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
            className
        )}
        {...props}
    >
        {children}
    </code>
);

const TypographyLead = ({ className, children, ...props }: React.ComponentProps<"p">) => (
    <p className={cn("text-muted-foreground text-xl", className)} {...props}>
        {children}
    </p>
);

export {
    TypographyH1,
    TypographyH2,
    TypographyH3,
    TypographyH4,
    TypographyP,
    TypographyLead,
    TypographyBlockquote,
    TypographyInlineCode,
};
