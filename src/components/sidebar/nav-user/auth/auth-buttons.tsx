"use client";

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
        className="overflow-hidden"
    >
        <Button className="w-full" asChild variant="secondary">
            <Link href="/auth">Accede ahora</Link>
        </Button>
    </motion.div>
);
