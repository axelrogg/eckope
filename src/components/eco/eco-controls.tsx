import * as React from "react";

import {
    ArrowBigDown,
    ArrowBigUp,
    Ellipsis,
    Flag,
    MessageCircle,
    Share,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface EcoControlsProps {
    upvotes: number;
    downvotes: number;
    showUpvoteButton?: boolean;
    showDownvoteButton?: boolean;
    showEcoButton?: boolean;
}

export const EcoControls = ({
    upvotes,
    downvotes,
    showUpvoteButton = true,
    showDownvoteButton = true,
    showEcoButton = true,
}: EcoControlsProps) => {
    return (
        <div className="flex flex-row items-center space-x-3">
            {showUpvoteButton && (
                <Button variant="ghost">
                    <ArrowBigUp />
                    {upvotes > 0 && <span>{upvotes}</span>}
                </Button>
            )}
            {showDownvoteButton && (
                <Button variant="ghost" className="">
                    <ArrowBigDown />
                    {downvotes > 0 && <span>{downvotes}</span>}
                </Button>
            )}
            {showEcoButton && (
                <Button variant="ghost">
                    <MessageCircle />
                    Eco
                </Button>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card">
                    <DropdownMenuItem>
                        <Share />
                        Compartir
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Flag />
                        Reportar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
