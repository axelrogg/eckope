import { AnimatePresence, motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResetMapGeoFilterButtonProps {
    show: boolean;
    onClick?: () => void;
}

export const ResetMapGeoFilterButton = ({
    show,
    onClick,
}: ResetMapGeoFilterButtonProps) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <Button className="bg-primary h-fit" onClick={onClick}>
                    Reiniciar
                    <RotateCcw className="ml-1 h-4 w-4" />
                </Button>
            </motion.div>
        )}
    </AnimatePresence>
);
