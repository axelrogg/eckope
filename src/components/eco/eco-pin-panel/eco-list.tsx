import { AnimatePresence, motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";

import { EcoPinPanelEco } from "@/components/eco/eco-pin-panel/eco";
import { Separator } from "@/components/ui/separator";
import { EcoPinPanelEcoListSkeleton } from "./skeletons";
import { fetchEcosByPinId } from "@/lib/api/eco-pins";
import { dateUtils } from "@/lib/utils/date";
import { User } from "@/types/auth";

interface EcoPinPanelEcoListProps {
    user: User;
    ecoPinId: string;
}

export const EcoPinPanelEcoList = ({ user, ecoPinId }: EcoPinPanelEcoListProps) => {
    const { data: ecos = [], isLoading: ecosLoading } = useQuery({
        queryKey: ["eco-list", ecoPinId],
        queryFn: () => fetchEcosByPinId(ecoPinId),
    });

    if (ecosLoading) {
        return <EcoPinPanelEcoListSkeleton />;
    }

    if (ecos.length === 0) {
        return (
            <div className="flex h-full items-start justify-center">
                <span className="">Sé el primero en emitir su eco.</span>
            </div>
        );
    }

    return (
        <AnimatePresence>
            {dateUtils.sortByUpdatedAtDesc(ecos).map((eco, i) => (
                <motion.div
                    key={eco.id}
                    initial={{ y: -80, opacity: 0, scale: 0.9 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        transition: {
                            type: "spring",
                            stiffness: 250, // still snappy
                            damping: 15, // less damping = more bounce
                            mass: 0.8,
                        },
                    }}
                    exit={{
                        y: -80,
                        opacity: 0,
                        scale: 0.9,
                        transition: { duration: 0.25 },
                    }}
                    layout
                >
                    <EcoPinPanelEco
                        id={eco.id}
                        user={user}
                        replyCount={eco.replyCount}
                        content={eco.content}
                        author={eco.author}
                        createdAt={eco.createdAt}
                        updatedAt={eco.updatedAt}
                        edited={eco.edited}
                    />
                    {i < ecos.length - 1 && <Separator className="my-2" />}
                </motion.div>
            ))}
        </AnimatePresence>
    );
};
