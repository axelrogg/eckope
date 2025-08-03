"use client";

import * as React from "react";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

interface SidebarItemProps {
    title: string;
    url: string;
    icon: React.ReactNode;
}

export const SidebarItem = ({ title, url, icon }: SidebarItemProps) => {
    const { open } = useSidebar();
    return (
        <Tooltip key={title}>
            <TooltipTrigger asChild>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={url}>
                            {icon}
                            <span>{title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </TooltipTrigger>
            <TooltipContent hidden={open} side="right">
                <span>{title}</span>
            </TooltipContent>
        </Tooltip>
    );
};
