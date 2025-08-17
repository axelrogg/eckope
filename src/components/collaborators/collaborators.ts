export type SocialMediaPlatform = "instagram";

interface CollaboratorSocialMedia {
    platform: SocialMediaPlatform;
    username: string;
}

interface Collaborators {
    name: string;
    socialMedia: CollaboratorSocialMedia[];
    bio: string;
    avatarUrl?: string;
    role: string;
}

export const collaborators: Collaborators[] = [
    {
        name: "Saskia Harumi Rodríguez Obando",
        bio: "Soy una estudiante de diseño profesional gráfico creativa e innovadora que le encanta jugar videojuegos y escuchar musica.",
        role: "Diseñadora gráfica",
        avatarUrl: "/collaborator-saskia_harumi_rodriguez_obando.jpeg",
        socialMedia: [
            {
                platform: "instagram",
                username: "hikari__2017",
            },
        ],
    },
];
