import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";

export async function getFeedFollowsForUser(userID: string) {
	try {
		const allFeedFollows = await db.select({
			feedName: feeds.name,
			addedBy: users.name,
			feedID: feeds.id,
		}).from(feedFollows).innerJoin(users, eq(feedFollows.user_id, users.id))
			.innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
			.where(eq(users.id, userID));
		return allFeedFollows;
	} catch (error) { throw error; }
}


export async function createFeedFollow(userID: string, feedID: string) {
	try {
		console.log(`userID => ${userID}`);
		console.log(`feedID => ${feedID}`);
		const [newFeedFollow] = await db.insert(feedFollows)
			.values({ user_id: userID, feed_id: feedID })
			.returning();

		const [result] = await db.select({
			feedFollowID: feedFollows.id,
			feedFollowCreatedAt: feedFollows.createdAt,
			feedFollowUpdatedAt: feedFollows.updatedAt,
			feedFollowUserID: feedFollows.user_id,
			userName: users.name,
			feedFollowsFeedID: feedFollows.feed_id,
			feedName: feeds.name,
		})
			.from(feedFollows)
			.innerJoin(users, eq(feedFollows.user_id, users.id))
			.innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))

		return result;
	} catch (error) {
		console.error("ERROR RAISED =>", error);
		throw error;
	}
}

export async function deleteFeedFollow(userID: string, feedID: string) {
	try {
		const deleted = await db.delete(feedFollows).where(
			and(
				eq(feedFollows.user_id, userID),
				eq(feedFollows.feed_id, feedID)
			)
		).returning();
		return deleted;
	} catch (error) { throw error };
}

