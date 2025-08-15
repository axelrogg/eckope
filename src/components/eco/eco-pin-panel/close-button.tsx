import { X } from "lucide-react";

import { SidePanelAction } from "@/components/side-panel/side-panel";
import { Button } from "@/components/ui/button";

interface EcoPinPanelCloseButtonProps {
    onClose: () => void;
}

export const EcoPinPanelCloseButton = ({ onClose }: EcoPinPanelCloseButtonProps) => (
    <SidePanelAction>
        <Button
            aria-label="Cerrar el panel de eco"
            variant="ghost"
            size="sm"
            onClick={onClose}
        >
            <X />
        </Button>
    </SidePanelAction>
);
