import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EcoAuthorProps {
    username?: string;
    fullName?: string;
    avatarUrl?: string;
}

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

export const EcoAuthor = ({
    username = "",
    fullName = "",
    avatarUrl = "",
}: EcoAuthorProps) => {
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
                {fullName && <span className="text-muted">{fullName}</span>}
            </div>
        </div>
    );
};
