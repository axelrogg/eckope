"use client";

import { BadgeInfo, Home } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NavHeader } from "./nav-header";

// Menu items.
const menuItems = [
    {
        title: "Mapa",
        url: "/",
        icon: Home,
    },
    {
        title: "¿Qué es Éckope?",
        url: "/about",
        icon: BadgeInfo,
    },
    //{
    //    title: "¿Cómo contribuir?",
    //    url: "/como-contribuir",
    //    icon: Hammer,
    //},
];

export function AppSidebar() {
    const { open } = useSidebar();
    return (
        <Sidebar side="left" collapsible="icon" variant="floating">
            <NavHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <Tooltip key={item.title}>
                                    <TooltipTrigger asChild>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </TooltipTrigger>
                                    <TooltipContent hidden={open} side="right">
                                        <p>{item.title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{ name: "hello", email: "email", avatar: "" }} />
            </SidebarFooter>
        </Sidebar>
    );
}
