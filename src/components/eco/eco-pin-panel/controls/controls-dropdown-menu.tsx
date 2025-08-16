import { Ellipsis, Flag, Share } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const ControlsDropdownMenu = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Ellipsis />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card">
                <DropdownMenuItem className="group">
                    <Share className="group-hover:text-background" />
                    Compartir
                </DropdownMenuItem>
                <DropdownMenuItem className="group">
                    <Flag className="group-hover:text-background" />
                    Reportar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
