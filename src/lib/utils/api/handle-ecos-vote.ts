import { and, eq } from "drizzle-orm";

import db from "@/lib/database/db";
import { ecoPins, ecoPinVotes, ecos, ecoVotes } from "@root/drizzle/schema";

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
            const [deleted] = await tx
                .delete(ecoPinVotes)
                .where(whereCondition)
                .returning();

            const [votes] = await tx
                .select({ upvotes: ecoPins.upvotes, downvotes: ecoPins.downvotes })
                .from(ecoPins)
                .where(eq(ecoPins.id, id))
                .limit(1);

            return {
                action: "deleted",
                vote: { status: false, voteType: null },
                data: { ...deleted, ...votes },
            };
        } else {
            /* Different vote type: update voteType */
            const [updated] = await tx
                .update(ecoPinVotes)
                .set({ voteType })
                .where(whereCondition)
                .returning();

            const [votes] = await tx
                .select({ upvotes: ecoPins.upvotes, downvotes: ecoPins.downvotes })
                .from(ecoPins)
                .where(eq(ecoPins.id, id))
                .limit(1);

            return {
                action: "updated",
                vote: { status: true, voteType },
                data: { ...updated, ...votes },
            };
        }
    }

    /* No existing vote; create a new one */
    const [inserted] = await tx
        .insert(ecoPinVotes)
        .values({ ecoPinId: id, userId, voteType })
        .onConflictDoUpdate({
            target: [ecoPinVotes.ecoPinId, ecoPinVotes.userId],
            set: { voteType },
        })
        .returning();

    const [votes] = await tx
        .select({ upvotes: ecoPins.upvotes, downvotes: ecoPins.downvotes })
        .from(ecoPins)
        .where(eq(ecoPins.id, id))
        .limit(1);

    return {
        action: "created",
        vote: { status: true, voteType },
        data: { ...inserted, ...votes },
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
            const [deleted] = await tx.delete(ecoVotes).where(whereCondition).returning();

            const [votes] = await tx
                .select({ upvotes: ecos.upvotes, downvotes: ecos.downvotes })
                .from(ecos)
                .where(eq(ecos.id, id))
                .limit(1);

            return {
                action: "deleted",
                vote: { status: false, voteType: null },
                data: { ...deleted, ...votes },
            };
        } else {
            /* Different vote type: update voteType */
            const [updated] = await tx
                .update(ecoVotes)
                .set({ voteType })
                .where(whereCondition)
                .returning();

            const [votes] = await tx
                .select({ upvotes: ecos.upvotes, downvotes: ecos.downvotes })
                .from(ecos)
                .where(eq(ecos.id, id))
                .limit(1);

            return {
                action: "updated",
                vote: { status: true, voteType },
                data: { ...updated, ...votes },
            };
        }
    }

    /* No existing vote; create a new one */
    const [inserted] = await tx
        .insert(ecoVotes)
        .values({ ecoId: id, userId, voteType })
        .onConflictDoUpdate({
            target: [ecoVotes.ecoId, ecoVotes.userId],
            set: { voteType },
        })
        .returning();

    const [votes] = await tx
        .select({ upvotes: ecos.upvotes, downvotes: ecos.downvotes })
        .from(ecos)
        .where(eq(ecos.id, id))
        .limit(1);

    return {
        action: "created",
        vote: { status: true, voteType },
        data: { ...inserted, ...votes },
    };
}

//export async function handleEcoReplyVotes({
//    tx,
//    id,
//    userId,
//    voteType,
//}: HandleEcosVoteParams) {
//
//    const whereCondition = and(
//        eq(ecoVotes.ecoId, id),
//        eq(ecoVotes.userId, userId)
//    );
//
//    const [existingVote] = await tx
//        .select()
//        .from(ecoPinVotes)
//        .where(whereCondition)
//        .limit(1);
//
//    if (existingVote) {
//        console.log("[handleEcosVote] :: Found existing vote:", existingVote);
//
//        if (existingVote.voteType === voteType) {
//            console.log(
//                `[handleEcosVote] :: Vote type matches (${voteType}), toggling off (deleting vote)`,
//                { ecoPinId: id, userId }
//            );
//
//            /* Toggle off: delete existing vote */
//            const [deleted] = await tx
//                .delete(ecoPinVotes)
//                .where(whereCondition)
//                .returning();
//            console.log("[handleEcosVote] :: Deleted vote", deleted);
//            const [votes] = await tx
//                .select({ upvotes: ecoPins.upvotes, downvotes: ecoPins.downvotes })
//                .from(ecoPins)
//                .where(eq(ecoPins.id, id))
//                .limit(1);
//
//           console.log("[handleEcosVote] :: Selecting new votes", votes);
//
//            return { action: "deleted", data: { ...deleted, ...votes } };
//        } else {
//            console.log(
//                `[handleEcosVote] :: Vote type different (existing: ${existingVote.voteType}, new: ${voteType}), updating vote`
//            );
//
//            /* Different vote type: update voteType */
//            const [updated] = await tx
//                .update(ecoPinVotes)
//                .set({ voteType })
//                .where(whereCondition)
//                .returning();
//
//            console.log("[handleEcosVote] :: Updated vote", updated);
//            const [votes] = await tx
//                .select({ upvotes: ecoPins.upvotes, downvotes: ecoPins.downvotes })
//                .from(ecoPins)
//                .where(eq(ecoPins.id, id))
//                .limit(1);
//
//            console.log("[handleEcosVote] :: Selecting new votes", votes);
//
//            return { action: "updated", data: { ...updated, ...votes } };
//        }
//    }
//
//    console.log(
//        `[handleEcosVote] :: No existing vote, inserting new vote with type: ${voteType}`
//    );
//
//    /* No existing vote; create a new one */
//    const [inserted] = await tx
//        .insert(ecoPinVotes)
//        .values({ ecoPinId: id, userId, voteType })
//        .onConflictDoUpdate({
//            target: [ecoPinVotes.ecoPinId, ecoPinVotes.userId],
//            set: { voteType },
//        })
//        .returning();
//
//    console.log("[handleEcosVote] :: Inserted (or upserted) vote", inserted);
//    const [votes] = await tx
//        .select({ upvotes: ecoPins.upvotes, downvotes: ecoPins.downvotes })
//        .from(ecoPins)
//        .where(eq(ecoPins.id, id))
//        .limit(1);
//
//    console.log("[handleEcosVote] :: Selecting new votes", votes);
//
//    return { action: "created", data: { ...inserted, ...votes } };
//}
//
