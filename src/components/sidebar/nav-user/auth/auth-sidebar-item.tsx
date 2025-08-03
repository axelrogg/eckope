import * as React from "react";
import { motion } from "motion/react";

import { SidebarItem } from "@/components/sidebar/sidebar-item";

export const AuthSidebarItem = ({ icon }: { icon: React.ReactNode }) => (
    <motion.div
        key="sidebar-item"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
    >
        <SidebarItem title="Ingresar sesión" url="/auth/login" icon={icon} />
    </motion.div>
);
