import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default async function CommonLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AppSidebar />
            <div>{children}</div>
        </>
    );
}
