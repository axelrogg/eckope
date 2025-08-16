import { auth, signOut } from "@/auth";
import { BadgeInfo, Hammer, Map } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarItem } from "@/components/sidebar/sidebar-item";
import { NavHeader } from "@/components/sidebar/nav-header";
import { NavUser } from "@/components/sidebar/nav-user";

// Menu items.
const menuItems = [
    {
        title: "Mapa",
        url: "/",
        icon: Map,
    },
    {
        title: "¿Qué es Éckope?",
        url: "/about",
        icon: BadgeInfo,
    },
    {
        title: "¿Cómo contribuir?",
        url: "/como-contribuir",
        icon: Hammer,
    },
];

export const AppSidebar = async () => {
    const session = await auth();

    const onSignOut = async () => {
        "use server";
        await signOut();
    };

    return (
        <Sidebar side="left" collapsible="icon" variant="floating">
            <NavHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarItem
                                    key={item.url}
                                    icon={<item.icon />}
                                    url={item.url}
                                    title={item.title}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={session?.user} onSignOut={onSignOut} />
            </SidebarFooter>
        </Sidebar>
    );
};
