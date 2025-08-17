import type { MDXComponents } from "mdx/types";
import {
    TypographyH1,
    TypographyH2,
    TypographyH3,
    TypographyH4,
    TypographyP,
} from "@/components/ui/typography";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children, props }) => <TypographyH1 {...props}>{children}</TypographyH1>,
        h2: ({ children, props }) => <TypographyH2 {...props}>{children}</TypographyH2>,
        h3: ({ children, props }) => <TypographyH3 {...props}>{children}</TypographyH3>,
        h4: ({ children, props }) => <TypographyH4 {...props}>{children}</TypographyH4>,
        p: ({ children, props }) => <TypographyP {...props}>{children}</TypographyP>,
        a: ({ children, ...props }) => (
            <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
            >
                {children}
            </a>
        ),
        ...components,
    };
}
