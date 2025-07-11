"use client";

import { useEffect, useState } from "react";
import { PanelTop } from "lucide-react";

import {
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";

export const NavHeader = () => {
    const { open } = useSidebar();
    const [enableHover, setEnableHover] = useState(false);

    // Delay hover mode activation after sidebar closes
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (!open) {
            timeout = setTimeout(() => {
                setEnableHover(true);
            }, 200); // Match sidebar transition time
        } else {
            setEnableHover(false);
        }

        return () => clearTimeout(timeout);
    }, [open]);

    const MenuButtonContent = ({
        open,
        enableHover,
    }: {
        open: boolean;
        enableHover: boolean;
    }) => {
        if (open || !enableHover) {
            return (
                <SidebarMenuButton
                    asChild
                    className="hover:text-foreground active:text-foreground justify-between hover:bg-transparent active:bg-transparent"
                >
                    <div>
                        <PanelTop />
                        <SidebarTrigger />
                    </div>
                </SidebarMenuButton>
            );
        }
        return (
            <SidebarMenuButton
                asChild
                className="group/header relative hover:bg-transparent active:bg-transparent"
            >
                <div>
                    {/* Icon (fades out on hover) */}
                    <PanelTop className="transition-opacity duration-200 ease-in-out group-hover/header:opacity-0" />

                    {/* SidebarTrigger (fades in on hover, positioned over the icon) */}
                    <div className="pointer-events-none absolute inset-0 flex scale-90 items-center justify-center opacity-0 transition-all duration-200 ease-in-out group-hover/header:pointer-events-auto group-hover/header:scale-100 group-hover/header:opacity-100">
                        <SidebarTrigger />
                    </div>
                </div>
            </SidebarMenuButton>
        );
    };

    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <MenuButtonContent open={open} enableHover={enableHover} />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    );
};
