import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import React from "react";

export const ControlAuthPrompt = ({ children }: { children: React.ReactNode }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button
                variant="ghost"
                className="group/button relative overflow-hidden px-3"
            >
                {children}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col items-center justify-center space-y-3">
            <span>¿Quieres participar?</span>
            <Button variant="secondary" asChild>
                <Link href="/auth">Inicia sesión</Link>
            </Button>
        </PopoverContent>
    </Popover>
);
