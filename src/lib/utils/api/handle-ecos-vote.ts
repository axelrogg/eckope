import { and, eq } from "drizzle-orm";

import db from "@/lib/database/db";
import {
    ecoPins,
    ecoPinVotes,
    ecoReplies,
    ecoReplyVotes,
    ecos,
    ecoVotes,
} from "@root/drizzle/schema";

interface HandleEcosVoteParams {
    tx: Parameters<Parameters<typeof db.transaction>[0]>[0];
    id: string;
    userId: string;
    voteType: "up" | "down";
}

export async function handleEcoPinVote({
    tx,
    id,
    userId,
    voteType,
}: HandleEcosVoteParams) {
    const whereCondition = and(
        eq(ecoPinVotes.ecoPinId, id),
        eq(ecoPinVotes.userId, userId)
    );

    const [existingVote] = await tx
        .select()
        .from(ecoPinVotes)
        .where(whereCondition)
        .limit(1);

    if (existingVote) {
        if (existingVote.voteType === voteType) {
            /* Toggle off: delete existing vote */
            await tx.delete(ecoPinVotes).where(whereCondition);

            const [votes] = await tx
                .select({
                    ecoPinId: ecoPins.id,
                    upvotes: ecoPins.upvotes,
                    downvotes: ecoPins.downvotes,
                })
                .from(ecoPins)
                .where(eq(ecoPins.id, id))
                .limit(1);

            return {
                action: "deleted",
                vote: { status: false, voteType: null },
                count: votes,
            };
        } else {
            /* Different vote type: update voteType */
            await tx.update(ecoPinVotes).set({ voteType }).where(whereCondition);

            const [votes] = await tx
                .select({
                    ecoPinId: ecoPins.id,
                    upvotes: ecoPins.upvotes,
                    downvotes: ecoPins.downvotes,
                })
                .from(ecoPins)
                .where(eq(ecoPins.id, id))
                .limit(1);

            return {
                action: "updated",
                vote: { status: true, voteType },
                count: votes,
            };
        }
    }

    /* No existing vote; create a new one */
    await tx
        .insert(ecoPinVotes)
        .values({ ecoPinId: id, userId, voteType })
        .onConflictDoUpdate({
            target: [ecoPinVotes.ecoPinId, ecoPinVotes.userId],
            set: { voteType },
        });

    const [votes] = await tx
        .select({
            ecoPinId: ecoPins.id,
            upvotes: ecoPins.upvotes,
            downvotes: ecoPins.downvotes,
        })
        .from(ecoPins)
        .where(eq(ecoPins.id, id))
        .limit(1);

    return {
        action: "created",
        vote: { status: true, voteType },
        count: votes,
    };
}

export async function handleEcoVote({ tx, id, userId, voteType }: HandleEcosVoteParams) {
    const whereCondition = and(eq(ecoVotes.ecoId, id), eq(ecoVotes.userId, userId));

    const [existingVote] = await tx
        .select()
        .from(ecoVotes)
        .where(whereCondition)
        .limit(1);

    if (existingVote) {
        if (existingVote.voteType === voteType) {
            /* Toggle off: delete existing vote */
            await tx.delete(ecoVotes).where(whereCondition);

            const [votes] = await tx
                .select({
                    ecoId: ecos.id,
                    upvotes: ecos.upvotes,
                    downvotes: ecos.downvotes,
                })
                .from(ecos)
                .where(eq(ecos.id, id))
                .limit(1);

            return {
                action: "deleted",
                vote: { status: false, voteType: null },
                count: votes,
            };
        } else {
            /* Different vote type: update voteType */
            await tx.update(ecoVotes).set({ voteType }).where(whereCondition);

            const [votes] = await tx
                .select({
                    ecoId: ecos.id,
                    upvotes: ecos.upvotes,
                    downvotes: ecos.downvotes,
                })
                .from(ecos)
                .where(eq(ecos.id, id))
                .limit(1);

            return {
                action: "updated",
                vote: { status: true, voteType },
                count: votes,
            };
        }
    }

    /* No existing vote; create a new one */
    await tx
        .insert(ecoVotes)
        .values({ ecoId: id, userId, voteType })
        .onConflictDoUpdate({
            target: [ecoVotes.ecoId, ecoVotes.userId],
            set: { voteType },
        });

    const [votes] = await tx
        .select({ ecoId: ecos.id, upvotes: ecos.upvotes, downvotes: ecos.downvotes })
        .from(ecos)
        .where(eq(ecos.id, id))
        .limit(1);

    return {
        action: "created",
        vote: { status: true, voteType },
        count: votes,
    };
}

export async function handleEcoReplyVote({
    tx,
    id,
    userId,
    voteType,
}: HandleEcosVoteParams) {
    const whereCondition = and(
        eq(ecoReplyVotes.ecoReplyId, id),
        eq(ecoReplyVotes.userId, userId)
    );

    const [existingVote] = await tx
        .select()
        .from(ecoReplyVotes)
        .where(whereCondition)
        .limit(1);

    if (existingVote) {
        if (existingVote.voteType === voteType) {
            /* Toggle off: delete existing vote */
            await tx.delete(ecoReplyVotes).where(whereCondition);
            const [votes] = await tx
                .select({
                    ecoReplyId: ecoReplies.id,
                    upvotes: ecoReplies.upvotes,
                    downvotes: ecoReplies.downvotes,
                })
                .from(ecoReplies)
                .where(eq(ecoReplies.id, id))
                .limit(1);

            return {
                action: "deleted",
                vote: { status: false, voteType: null },
                count: votes,
            };
        } else {
            /* Different vote type: update voteType */
            await tx.update(ecoReplyVotes).set({ voteType }).where(whereCondition);

            const [votes] = await tx
                .select({
                    ecoReplyId: ecoReplies.id,
                    upvotes: ecoReplies.upvotes,
                    downvotes: ecoReplies.downvotes,
                })
                .from(ecoReplies)
                .where(eq(ecoReplies.id, id))
                .limit(1);

            return { action: "updated", vote: { status: true, voteType }, count: votes };
        }
    }

    /* No existing vote; create a new one */
    await tx
        .insert(ecoReplyVotes)
        .values({ ecoReplyId: id, userId, voteType })
        .onConflictDoUpdate({
            target: [ecoReplyVotes.ecoReplyId, ecoReplyVotes.userId],
            set: { voteType },
        })
        .returning();

    const [votes] = await tx
        .select({
            ecoReplyId: ecoReplies.id,
            upvotes: ecoReplies.upvotes,
            downvotes: ecoReplies.downvotes,
        })
        .from(ecoReplies)
        .where(eq(ecoReplies.id, id))
        .limit(1);

    return { action: "created", vote: { status: true, voteType }, count: votes };
}
