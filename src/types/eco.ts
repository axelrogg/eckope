export type EcoAuthor = {
    username?: string;
    fullName?: string;
    avatarUrl?: string;
};

export interface EcoBase {
    id: string;
    author: EcoAuthor;
    content: string;
    upvotes: number;
    downvotes: number;
    edited: boolean;
    createdAt: Date;
    editedAt?: Date;
}

export interface EcoPin extends EcoBase {
    title: string;
    ecos: Eco[];
}

export interface Eco extends EcoBase {
    ecoPinId: string;
    replies: EcoReply[];
}

export interface EcoReply extends EcoBase {
    ecoId: string;
}
