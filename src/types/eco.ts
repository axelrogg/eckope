import { Point } from "geojson";
import { ALL_ECOPIN_CATEGORIES, ALL_ECOPIN_SEVERITIES } from "@/lib/schemas/constants";

export type EcoAuthor = {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
};

export type EcoPinSeverity = (typeof ALL_ECOPIN_SEVERITIES)[number];
export type EcoPinCategory = (typeof ALL_ECOPIN_CATEGORIES)[number];

export interface EcoBase {
    id: string;
    author: EcoAuthor;
    content: string;
    upvotes: number;
    downvotes: number;
    edited: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Eco extends EcoBase {
    ecoPinId: string;
    replyCount: number;
}

interface EcoPinBase extends EcoBase {
    title: string;
    location: Point;
    severity: EcoPinSeverity;
}

interface StandardEcoPin extends EcoPinBase {
    category: Exclude<EcoPinCategory, "other">;
    customCategory?: undefined | null;
}

interface CustomCategoryEcoPin extends EcoPinBase {
    category: "other";
    customCategory: string;
}

export type EcoPin = StandardEcoPin | CustomCategoryEcoPin;

export interface EcoReply extends EcoBase {
    ecoId: string;
}

export type VoteType = "up" | "down";

export type Vote = {
    status: boolean;
    voteType: VoteType | null;
};

export type VoteCounts = {
    upvotes: number;
    downvotes: number;
};

export type EcoType = "eco-pin" | "eco" | "reply";

export type EcoPinVoteCount = { ecoPinId: string } & VoteCounts;
export type EcoPinVoteDetails = { vote: Vote; count: EcoPinVoteCount };
export type EcoPinVoteUnauthenticated = { ecoPinId: string } & VoteCounts;

export type EcoPinVote = EcoPinVoteDetails | EcoPinVoteUnauthenticated;

export type EcoVoteCount = { ecoId: string } & VoteCounts;
export type EcoVoteDetails = { vote: Vote; count: EcoVoteCount };
export type EcoVoteUnauthenticated = { ecoId: string } & VoteCounts;

export type EcoVote = EcoVoteDetails | EcoVoteUnauthenticated;
