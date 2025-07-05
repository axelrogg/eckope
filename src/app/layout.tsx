import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "Éckope",
    description: "description",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

const font = Space_Grotesk({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${font.className} antialiased`}>{children}</body>
        </html>
    );
}
