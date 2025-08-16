"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { calculateVoteChange } from "@/lib/utils/votes";
import { EcoReplyVote, EcoReplyVoteDetails, VoteType } from "@/types/eco";
import { fetchEcoReplyVotes, postEcoReplyVote } from "@/lib/api/eco-replies";
import { EcoVoteButton } from "../eco-vote-button";
import { ControlsDropdownMenu } from "./controls-dropdown-menu";

const ECO_REPLY_CONTROLS_QUERY_NAME = "eco-reply-controls";

interface EcoReplyControlsProps {
    id: string;
}

export const EcoReplyControls = ({ id }: EcoReplyControlsProps) => {
    const queryClient = useQueryClient();
    const { data: votesData, isLoading: votesLoading } = useQuery({
        queryKey: [ECO_REPLY_CONTROLS_QUERY_NAME, id],
        queryFn: () => fetchEcoReplyVotes(id),
    });

    const cachedVotes =
        queryClient.getQueryData<EcoReplyVote>([ECO_REPLY_CONTROLS_QUERY_NAME, id]) ??
        votesData;

    const vote = useMutation({
        mutationFn: ({ voteType }: { voteType: VoteType }) =>
            postEcoReplyVote(id, voteType),
        onMutate: async ({ voteType }: { voteType: VoteType }) => {
            await queryClient.cancelQueries({
                queryKey: [ECO_REPLY_CONTROLS_QUERY_NAME, id],
            });

            const prevData = queryClient.getQueryData<EcoReplyVote>([
                ECO_REPLY_CONTROLS_QUERY_NAME,
                id,
            ]);

            if (!prevData) return { prevData };
            if (!("vote" in prevData)) return { prevData };

            const currentUserVote = {
                status: prevData.vote.status,
                voteType: prevData.vote.voteType,
            };

            const newVote = calculateVoteChange({
                userVote: currentUserVote,
                voteType,
            });

            queryClient.setQueryData<EcoReplyVote>([ECO_REPLY_CONTROLS_QUERY_NAME, id], {
                count: {
                    ecoReplyId: prevData.count.ecoReplyId,
                    upvotes: prevData.count.upvotes + newVote.voteChange.upvotes,
                    downvotes: prevData.count.downvotes + newVote.voteChange.downvotes,
                },
                vote: newVote.userVote,
            });

            return { prevData };
        },
        onError: (err, _vars, context) => {
            console.error("on error", err);
            if (!context) {
                toast.error("No se pudo registrar el voto");
                return;
            }
            queryClient.setQueryData<EcoReplyVoteDetails>(
                [ECO_REPLY_CONTROLS_QUERY_NAME, id],
                context.prevData as EcoReplyVoteDetails
            );
            toast.error("No se pudo registrar el voto");
        },
        onSuccess: (data) => {
            queryClient.setQueryData<EcoReplyVoteDetails>(
                [ECO_REPLY_CONTROLS_QUERY_NAME, id],
                {
                    count: {
                        ecoReplyId: data.count.ecoReplyId,
                        upvotes: data.count.upvotes,
                        downvotes: data.count.downvotes,
                    },
                    vote: {
                        status: data.vote.status,
                        voteType: data.vote.voteType,
                    },
                }
            );
        },
    });

    if (votesLoading || !votesData) {
        return <Skeleton className="h-[36px] w-full" />;
    }

    const isCurrentVote = (voteType: VoteType) => {
        if (!cachedVotes) return false;
        if (!("vote" in cachedVotes)) return false;
        return cachedVotes.vote.status === true && cachedVotes.vote.voteType === voteType;
    };

    const voteCount = (voteType: VoteType) => {
        if (!votesData) return 0;
        if (!("vote" in votesData)) return 0;
        return voteType === "up" ? votesData.count.upvotes : votesData.count.downvotes;
    };

    return (
        <div className="flex flex-row items-center space-x-3">
            <EcoVoteButton
                type="up"
                isCurrentVote={isCurrentVote("up")}
                voteCount={voteCount("up")}
                onClick={() => vote.mutate({ voteType: "up" })}
            />
            <EcoVoteButton
                type="down"
                isCurrentVote={isCurrentVote("down")}
                voteCount={voteCount("down")}
                onClick={() => vote.mutate({ voteType: "down" })}
            />

            <ControlsDropdownMenu />
        </div>
    );
};
