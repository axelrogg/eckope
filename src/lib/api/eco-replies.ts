import { EcoReply, EcoReplyVote, EcoReplyVoteDetails, VoteType } from "@/types/eco";
import { HttpSuccessResponseOptions } from "@/types/http-response";
import { NewEcoReplyFormSchemaType } from "../schemas/new-eco-reply";

export async function fetchEcoReplyVotes(ecoReplyId: string) {
    const response = await fetch(`/api/eco-replies/${ecoReplyId}/votes`);
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<EcoReplyVote>>();
    return result.data;
}

export async function postEcoReplyVote(ecoReplyId: string, voteType: VoteType) {
    const response = await fetch(`/api/eco-replies/${ecoReplyId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            [voteType === "up" ? "upvote" : "downvote"]: true,
        }),
    });
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<EcoReplyVoteDetails>>();
    return result.data;
}

export async function postEcoReply(values: NewEcoReplyFormSchemaType) {
    const response = await fetch("/api/eco-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<HttpSuccessResponseOptions<EcoReply>>();
    return result.data;
}
