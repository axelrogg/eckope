import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dateUtils } from "@/lib/utils/date";
import { EcoAuthor as EcoAuthorType } from "@/types/eco";

interface EcoAuthorProps {
    author: EcoAuthorType;
    createdAt: Date;
}

export const EcoAuthor = ({ author, createdAt }: EcoAuthorProps) => {
    if (!author.id || !author.email) {
        return (
            <div className="flex flex-row items-center space-x-2">
                <Avatar>
                    <AvatarFallback>{getInitials("Deleted User")}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span>[usuario eliminado]</span>
                    <div className="space-x-3">
                        <span className="text-muted">
                            {dateUtils.timeSince(createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    const { name, image, email } = author;

    return (
        <div className="flex flex-row items-center space-x-2">
            <Avatar>
                <AvatarImage loading="lazy" src={image ?? ""} alt={name || "Avatar"} />
                <AvatarFallback>{getInitials(name ?? "")}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span>{name ? `${name}` : "[eliminado]"}</span>
                <div className="space-x-3">
                    <span className="text-muted">{email}</span>
                    {name && <span className="text-muted">•</span>}
                    <span className="text-muted">{dateUtils.timeSince(createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

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
