import { sql, eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

// FEEDS TABLE FUNCTIONS
export async function createFeed(userID: string, name: string, url: string) {
	const [result] = await db.insert(feeds)
		.values({ name: name, url: url, user_id: userID })
		.returning();
	return result;

}

export async function getFeeds() {
	const result = await db.select({
		feedName: feeds.name,
		feedURL: feeds.url,
		userName: users.name,
	})
		.from(feeds)
		.innerJoin(users, eq(feeds.user_id, users.id));
	return result;
}

export async function getFeedByUrl(url: string) {
	const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
	return result;
}

export async function markFeedFetched(feedId: string) {
	try {
		await db.update(feeds)
			.set({ last_fetched_at: new Date(), updatedAt: new Date() })
			.where(eq(feeds.id, feedId));
	} catch (error) { throw error; }
}

export async function getNextFeedToFetch() {
	try {
		const result = await db.select()
			.from(feeds)
			.orderBy(sql`${feeds.last_fetched_at} ASC NULLS FIRST`)
		return result;
	} catch (error) { throw error; }

}
