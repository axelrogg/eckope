import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Card,
    CardHeader as SidePanelHeader,
    CardTitle as SidePanelTitle,
    CardDescription as SidePanelDescription,
    CardAction as SidePanelAction,
    CardContent as SidePanelContent,
    CardFooter as SidePanelFooter,
} from "@/components/ui/card";

interface SidePanelProps {
    /** Whether the side panel is visible */
    show: boolean;
    /** The content to render inside the side panel */
    children: React.ReactNode;
}

/**
 * SidePanel
 *
 * A composable UI container rendered as a side panel overlay.
 * Designed for tasks like form entry, detail views, or workflows requiring user focus away from the map.
 *
 * This component uses `motion.div` (via Framer Motion) to animate entry/exit from the right edge of the screen.
 * Internally, it renders a `Card` component for consistent styling and layout.
 *
 * All subcomponents (`SidePanelHeader`, `SidePanelTitle`, etc.) are aliases of `Card` components,
 * ensuring visual and structural consistency across your UI.
 *
 * It always slides in from the **right** side of the screen to avoid interfering with the main app sidebar,
 * which is typically located on the left.
 *
 * Example usage:
 *
 * ```tsx
 * <SidePanel show={open}>
 *     <SidePanelHeader>
 *         <SidePanelTitle>Title</SidePanelTitle>
 *         <SidePanelAction>
 *             <Button onClick={onClose}>X</Button>
 *         </SidePanelAction>
 *     </SidePanelHeader>
 *     <SidePanelContent>
 *         <p>Some content here</p>
 *     </SidePanelContent>
 * </SidePanel>
 * ```
 */
const SidePanel = ({ show, children }: SidePanelProps) => {
    React.useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        }
    }, [show]);

    const handleAnimationComplete = () => {
        if (!show) {
            document.body.style.overflow = "";
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    data-slot="side-panel"
                    className="absolute top-0 right-0 z-50 h-svh bg-transparent p-2 lg:w-120"
                    role="dialog"
                    aria-modal="true"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onAnimationComplete={handleAnimationComplete}
                >
                    <ScrollArea className="h-full rounded-xl">
                        <Card className="h-full">{children}</Card>
                    </ScrollArea>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export {
    SidePanel,
    SidePanelHeader,
    SidePanelTitle,
    SidePanelDescription,
    SidePanelAction,
    SidePanelContent,
    SidePanelFooter,
};
