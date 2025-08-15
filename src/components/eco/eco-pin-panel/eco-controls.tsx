"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

import { fetchEcoVotes, postEcoVote } from "@/lib/api/ecos";
import { EcoVote, EcoVoteDetails, VoteType } from "@/types/eco";
import { EcoVoteButton } from "./eco-vote-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ControlsDropdownMenu } from "./controls-dropdown-menu";
import { calculateVoteChange } from "@/lib/utils/votes";

const ECO_CONTROLS_QUERY_NAME = "eco-controls";

interface EcoControlsProps {
    id: string;
}

export const EcoControls = ({ id }: EcoControlsProps) => {
    const queryClient = useQueryClient();
    const { data: votesData, isLoading: votesLoading } = useQuery({
        queryKey: [ECO_CONTROLS_QUERY_NAME, id],
        queryFn: () => fetchEcoVotes(id),
    });
    const cachedVotes =
        queryClient.getQueryData<EcoVote>([ECO_CONTROLS_QUERY_NAME, id]) ?? votesData;

    const vote = useMutation({
        mutationFn: ({ voteType }: { voteType: VoteType }) => postEcoVote(id, voteType),
        onMutate: async ({ voteType }: { voteType: VoteType }) => {
            await queryClient.cancelQueries({ queryKey: [ECO_CONTROLS_QUERY_NAME, id] });

            const prevData = queryClient.getQueryData<EcoVote>([
                ECO_CONTROLS_QUERY_NAME,
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

            // Optimistically update the cache
            queryClient.setQueryData<EcoVote>([ECO_CONTROLS_QUERY_NAME, id], {
                count: {
                    ecoId: prevData.count.ecoId,
                    upvotes: prevData.count.upvotes + newVote.voteChange.upvotes,
                    downvotes: prevData.count.downvotes + newVote.voteChange.downvotes,
                },
                vote: newVote.userVote,
            });

            return { prevData };
        },
        onError: (err, _vars, context) => {
            console.error("on error error", err);
            if (!context) {
                toast.error("No se pudo registrar el voto");
                return;
            }

            queryClient.setQueryData<EcoVoteDetails>(
                [ECO_CONTROLS_QUERY_NAME, id],
                context.prevData as EcoVoteDetails
            );
            toast.error("No se pudo registrar el voto");
        },
        onSuccess: (data) => {
            queryClient.setQueryData<EcoVoteDetails>([ECO_CONTROLS_QUERY_NAME, id], {
                count: {
                    ecoId: data.count.ecoId,
                    upvotes: data.count.upvotes,
                    downvotes: data.count.downvotes,
                },
                vote: {
                    status: data.vote.status,
                    voteType: data.vote.voteType,
                },
            });
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

            <Button variant="ghost">
                <MessageCircle />
                Responder
            </Button>

            <ControlsDropdownMenu />
        </div>
    );
};
