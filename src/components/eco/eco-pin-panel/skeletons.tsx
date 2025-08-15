import {
    SidePanelDescription,
    SidePanelHeader,
} from "@/components/side-panel/side-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { EcoPinPanelCloseButton } from "@/components/eco/eco-pin-panel/close-button";

export const EcoPinPanelPinContentSkeleton = () => {
    return (
        <div className="space-y-3">
            <Skeleton className="h-[140px] w-full" />
            <Skeleton className="h-[36px] w-full" />
            <Skeleton className="h-[36px] w-full" />
        </div>
    );
};

export const EcoPinPanelEcoListSkeleton = () => {
    return Array.from({ length: 3 }, (_, i) => i).map((i) => (
        <div key={i} className="space-y-3">
            <Skeleton className="h-[72px] w-full" />
            <Skeleton className="h-[36px] w-full" />
            <Skeleton className="h-[36px] w-full" />
        </div>
    ));
};

interface EcoPinPanelHeaderSkeletonProps {
    onClose: () => void;
}

export const EcoPinPanelHeaderSkeleton = ({
    onClose,
}: EcoPinPanelHeaderSkeletonProps) => (
    <SidePanelHeader>
        <Skeleton className="h-[28px] w-full" />

        <SidePanelDescription>
            <Skeleton className="h-[40px] w-full" />
        </SidePanelDescription>

        <EcoPinPanelCloseButton onClose={onClose} />
    </SidePanelHeader>
);
