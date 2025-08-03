import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export const AuthButtons = () => (
    <motion.div
        key="auth-buttons"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-2 overflow-hidden"
    >
        <Button className="w-full" asChild>
            <Link href="/auth/login">Ingresar sesión</Link>
        </Button>
        <Button className="w-full" variant="secondary" asChild>
            <Link href="/auth/create-account">Crear cuenta</Link>
        </Button>
    </motion.div>
);
