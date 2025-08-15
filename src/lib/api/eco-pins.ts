import { HttpSuccessResponseOptions } from "@/types/http-response";
import { Eco, EcoPin, EcoPinVote, EcoPinVoteDetails, VoteType } from "@/types/eco";

export async function fetchEcoPinById(ecoPinId: string) {
    const response = await fetch(`/api/eco-pins/${ecoPinId}`);
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<EcoPin>>();
    return result.data;
}

export async function fetchEcosByPinId(ecoPinId: string) {
    const response = await fetch(`/api/eco-pins/${ecoPinId}/ecos`);
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<Eco[]>>();
    return result.data;
}

export async function fetchEcoPinVotes(ecoPinId: string) {
    const response = await fetch(`/api/eco-pins/${ecoPinId}/votes`);
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<EcoPinVote>>();
    return result.data;
}

export async function postEcoPinVote(ecoPinId: string, voteType: VoteType) {
    const response = await fetch(`/api/eco-pins/${ecoPinId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            [voteType === "up" ? "upvote" : "downvote"]: true,
        }),
    });
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<EcoPinVoteDetails>>();
    return result.data;
}
