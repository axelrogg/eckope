import { AnimatePresence, motion } from "motion/react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ControlAuthPrompt } from "./controls/control-auth-prompt";
import { cn } from "@/lib/utils/cn";
import { VoteType } from "@/types/eco";
import { User } from "@/types/auth";

interface EcoVoteButtonProps {
    type: VoteType;
    isCurrentVote: boolean;
    voteCount: number;
    user: User | null;
    onClick: () => void;
}

export const EcoVoteButton = ({
    user,
    type,
    isCurrentVote,
    voteCount,
    onClick,
}: EcoVoteButtonProps) => {
    const ButtonIcon = type === "up" ? ArrowBigUp : ArrowBigDown;

    if (!user) {
        return (
            <ControlAuthPrompt>
                <ButtonIcon className="group-hover/button:text-background transition-colors duration-300" />
            </ControlAuthPrompt>
        );
    }

    return (
        <Button
            variant="ghost"
            className="group/button relative overflow-hidden px-3"
            onClick={onClick}
        >
            <motion.div
                key={isCurrentVote ? "active" : "inactive"}
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                <ButtonIcon
                    className={cn(
                        "group-hover/button:text-background transition-colors duration-300",
                        isCurrentVote
                            ? "fill-accent text-accent group-hover/button:fill-background"
                            : "text-foreground"
                    )}
                />
            </motion.div>

            <AnimatePresence>
                {voteCount > 0 && (
                    <motion.span
                        key={voteCount}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "group-hover/button:text-background ml-1 transition-colors duration-300",
                            isCurrentVote ? "text-accent" : "text-foreground"
                        )}
                    >
                        {voteCount}
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );
};
