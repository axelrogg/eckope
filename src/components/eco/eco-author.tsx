import { EcoAuthor as EcoAuthorType } from "@/types/eco";
import { dateUtils } from "@/lib/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getInitials(name?: string): string {
    if (!name) return "AN";

    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    const word = parts[0];
    if (word.length >= 2) {
        return word.slice(0, 2).toUpperCase();
    }

    return (word[0] + "N").toUpperCase();
}

interface EcoAuthorProps {
    author: EcoAuthorType;
    createdAt: Date;
}

export const EcoAuthor = ({ author, createdAt }: EcoAuthorProps) => {
    const { username, fullName, avatarUrl } = author;

    return (
        <div className="flex flex-row items-center space-x-2">
            <Avatar>
                <AvatarImage
                    loading="lazy"
                    src={avatarUrl}
                    alt={fullName || username || "Avatar"}
                />
                <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span>{username ? `@${username}` : "[eliminado]"}</span>
                <div className="space-x-3">
                    {fullName && <span className="text-muted">{fullName}</span>}
                    {fullName && <span className="text-muted">•</span>}
                    <span className="text-muted">{dateUtils.timeSince(createdAt)}</span>
                </div>
            </div>
        </div>
    );
};
