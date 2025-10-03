import { eq } from "drizzle-orm";
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



