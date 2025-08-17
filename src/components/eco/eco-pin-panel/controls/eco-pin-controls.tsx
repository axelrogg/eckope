"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchEcoPinVotes, postEcoPinVote } from "@/lib/api/eco-pins";
import { calculateVoteChange } from "@/lib/utils/votes";
import { EcoPinVote, VoteType } from "@/types/eco";
import { ControlsDropdownMenu } from "./controls-dropdown-menu";
import { EcoVoteButton } from "../eco-vote-button";
import { User } from "@/types/auth";

const ECOPIN_CONTROLS_QUERY_NAME = "eco-pin-controls";

interface EcoPinControlsProps {
    user: User | null;
    id: string;
}

export const EcoPinControls = ({ id, user }: EcoPinControlsProps) => {
    const queryClient = useQueryClient();
    const { data: votesData, isLoading: votesLoading } = useQuery({
        queryKey: [ECOPIN_CONTROLS_QUERY_NAME, id],
        queryFn: () => fetchEcoPinVotes(id),
    });
    const cachedVotes =
        queryClient.getQueryData<EcoPinVote>([ECOPIN_CONTROLS_QUERY_NAME, id]) ??
        votesData;

    const vote = useMutation({
        mutationFn: ({ voteType }: { voteType: VoteType }) =>
            postEcoPinVote(id, voteType),
        onMutate: async ({ voteType }: { voteType: VoteType }) => {
            await queryClient.cancelQueries({
                queryKey: [ECOPIN_CONTROLS_QUERY_NAME, id],
            });

            const prevData = queryClient.getQueryData<EcoPinVote>([
                ECOPIN_CONTROLS_QUERY_NAME,
                id,
            ]);

            if (!prevData) return { prevData };
            if (!("vote" in prevData)) return { prevData };

            // Use the most recent userVote from the cache
            const currentUserVote = {
                status: prevData.vote.status,
                voteType: prevData.vote.voteType,
            };
            const newVote = calculateVoteChange({
                userVote: currentUserVote,
                voteType,
            });

            // Optimistically update the cache
            queryClient.setQueryData<EcoPinVote>([ECOPIN_CONTROLS_QUERY_NAME, id], {
                count: {
                    ecoPinId: prevData.count.ecoPinId,
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
            queryClient.setQueryData<EcoPinVote>(
                [ECOPIN_CONTROLS_QUERY_NAME, id],
                context.prevData
            );
            toast.error("No se pudo registrar el voto");
        },
        onSuccess: (data) => {
            queryClient.setQueryData<EcoPinVote>([ECOPIN_CONTROLS_QUERY_NAME, id], {
                count: {
                    ecoPinId: data.count.ecoPinId,
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

    if (votesLoading || !votesData) {
        return <Skeleton className="h-[36px] w-full" />;
    }

    return (
        <div className="flex flex-row items-center space-x-3">
            <EcoVoteButton
                user={user}
                type="up"
                isCurrentVote={isCurrentVote("up")}
                voteCount={voteCount("up")}
                onClick={() => vote.mutate({ voteType: "up" })}
            />

            <EcoVoteButton
                user={user}
                type="down"
                isCurrentVote={isCurrentVote("down")}
                voteCount={voteCount("down")}
                onClick={() => vote.mutate({ voteType: "down" })}
            />

            <ControlsDropdownMenu />
        </div>
    );
};
