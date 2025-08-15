import { Vote, VoteType } from "@/types/eco";

export function calculateVoteChange({
    userVote,
    voteType,
}: {
    userVote: Vote;
    voteType: VoteType;
}) {
    const voteChange = { upvotes: 0, downvotes: 0 };
    const newUserVote: Vote = { ...userVote };

    if (!userVote.status) {
        // User has never voted before, so we just increase the corresponding vote number by 1
        voteChange.upvotes = voteType === "up" ? 1 : 0;
        voteChange.downvotes = voteType === "down" ? 1 : 0;

        newUserVote.voteType = voteType;
        newUserVote.status = true;
    } else if (userVote.voteType === voteType) {
        // The user is toggling off their vote
        voteChange.upvotes = voteType === "up" ? -1 : 0;
        voteChange.downvotes = voteType === "down" ? -1 : 0;

        newUserVote.voteType = null;
        newUserVote.status = false;
    } else {
        // The user decided to change their vote
        voteChange.upvotes = voteType === "up" ? 1 : -1;
        voteChange.downvotes = voteType === "down" ? 1 : -1;

        newUserVote.voteType = voteType;
    }

    return { userVote: newUserVote, voteChange };
}
