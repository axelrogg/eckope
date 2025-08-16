"use client";

import * as React from "react";

import { AnimatePresence } from "motion/react";
import { CircleUserRound } from "lucide-react";

import { SidebarMenu, useSidebar } from "@/components/ui/sidebar";
import { NavUserDropdown } from "@/components/sidebar/nav-user/nav-user-dropdown";
import { AuthButtons } from "@/components/sidebar/nav-user/auth";
import { AuthSidebarItem } from "@/components/sidebar/nav-user/auth";
import { User } from "@/types/auth";

interface NavUserProps {
    user?: User;
    onSignOut: () => Promise<void>;
}

export function NavUser({ user, onSignOut }: NavUserProps) {
    const { open } = useSidebar();

    return (
        <SidebarMenu>
            {user ? (
                <NavUserDropdown user={user} onSignOut={onSignOut} />
            ) : (
                <AnimatePresence mode="wait">
                    {open ? (
                        <AuthButtons />
                    ) : (
                        <AuthSidebarItem icon={<CircleUserRound />} />
                    )}
                </AnimatePresence>
            )}
        </SidebarMenu>
    );
}
