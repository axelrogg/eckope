import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { cookies } from "next/headers";

import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "@/components/providers";

const font = Space_Grotesk({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Éckope",
    description: "",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <html lang="es">
            <body className={`${font.className} antialiased`}>
                <ReactQueryProvider>
                    <SidebarProvider defaultOpen={defaultOpen}>
                        <main>
                            <SidebarTrigger className="absolute top-2 left-2 md:hidden" />
                            {children}
                        </main>
                        <Toaster position="top-center" />
                    </SidebarProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
