import { PageDiv } from "@/components/ui/page-div";

export default function InfoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <PageDiv>{children}</PageDiv>;
}
