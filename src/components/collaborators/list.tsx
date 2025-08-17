import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { collaborators, SocialMediaPlatform } from "./collaborators";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export const CollaboratorsList = () => {
    const socialMediaLink = (platform: SocialMediaPlatform, username: string) => {
        if (platform === "instagram") return `https://instagram.com/${username}`;
    };

    return collaborators.map((collab) => (
        <Card key={collab.name} className="my-6 w-96">
            <CardHeader>
                <div className="flex flex-row items-center space-x-3">
                    <Avatar className="inline-flex size-12 items-center justify-center overflow-hidden rounded-full">
                        <AvatarImage
                            src={collab.avatarUrl}
                            loading="lazy"
                            className="object-cover"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                        <CardTitle>{collab.name}</CardTitle>
                        <CardDescription className="text-muted">
                            {collab.role}
                        </CardDescription>
                    </div>
                </div>
                <div className="ml-15">
                    {collab.socialMedia.map((sm) => (
                        <a
                            key={sm.username}
                            href={socialMediaLink(sm.platform, sm.username)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Avatar className="size-4 rounded-none">
                                <AvatarImage src="/instagram_logo.svg" />
                                <AvatarFallback>{sm.platform}</AvatarFallback>
                            </Avatar>
                        </a>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription>{collab.bio}</CardDescription>
            </CardContent>
        </Card>
    ));
};
