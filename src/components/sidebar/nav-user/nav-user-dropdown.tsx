"use client";

import { User } from "next-auth";
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils/initials";

interface NavUserDropdownProps {
    user?: User;
    onSignOut: () => Promise<void>;
}

export const NavUserDropdown = ({ user, onSignOut }: NavUserDropdownProps) => {
    const { isMobile, open } = useSidebar();

    const name = user?.name ? user.name : "";
    const email = user?.email ? user.email : "";
    const initials = getInitials(name);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className={`${open ? "" : "hover:text-foreground active:text-foreground hover:bg-transparent active:bg-transparent"}`}
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                            src={user?.image ? user.image : undefined}
                            alt="Avatar de usuario"
                        />
                        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{name}</span>
                        <span className="truncate text-xs">{email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                src={user?.image ? user.image : undefined}
                                alt="Avatar de usuario"
                            />
                            <AvatarFallback className="rounded-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{name}</span>
                            <span className="truncate text-xs">{email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BadgeCheck className="hover:text-accent-foreground" />
                        Mi cuenta
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Bell className="hover:text-accent-foreground" />
                        Notificaciones
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    asChild
                    className="bg-transparent p-0 hover:bg-transparent focus:bg-transparent"
                >
                    <form action={onSignOut}>
                        <Button
                            className="w-full justify-start has-[>svg]:px-2"
                            variant="destructive"
                            type="submit"
                        >
                            <LogOut className="hover:text-accent-foreground" />
                            Cerrar sesión
                        </Button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
