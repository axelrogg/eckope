import { Eco, EcoReply, EcoVote, EcoVoteDetails, VoteType } from "@/types/eco";
import { HttpSuccessResponseOptions } from "@/types/http-response";
import { NewEcoFormSchemaType } from "@/lib/schemas/new-eco";

export async function postEco(values: NewEcoFormSchemaType) {
    const response = await fetch("/api/ecos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });

    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<Eco>>();
    return result.data;
}

export async function fetchEcoVotes(ecoId: string) {
    const response = await fetch(`/api/ecos/${ecoId}/votes`);
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<EcoVote>>();
    console.log("fetch eco votes result", result);
    return result.data;
}

export async function postEcoVote(ecoId: string, voteType: VoteType) {
    const response = await fetch(`/api/ecos/${ecoId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            [voteType === "up" ? "upvote" : "downvote"]: true,
        }),
    });
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<EcoVoteDetails>>();
    return result.data;
}

export async function fetchEcoRepliesByEcoId(ecoId: string) {
    const response = await fetch(`/api/ecos/${ecoId}/replies`);
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<EcoReply[]>>();
    return result.data;
}
