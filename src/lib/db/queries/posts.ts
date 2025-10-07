import { User } from "src/helpers";
import { db } from "..";
import { posts } from "../schema";
import { desc, inArray } from "drizzle-orm";
import { getFeeds } from "./feeds";
import { getFeedFollowsForUser } from "./feedFollow";

export async function createPost(title: string, url: string, feedId: string, publishedAt: string, description?: string) {
	const publishedAsDate = new Date(publishedAt);
	const [result] = await db.insert(posts)
		.values({
			title: title,
			url: url,
			feedID: feedId,
			description: description,
			publishedAt: publishedAsDate,
		})
		.returning();
	return result;
}


export async function getPostsForUser(user: User, limit: number) {
	// Get a user's feeds
	const userFeeds = await getFeedFollowsForUser(user.id);
	const feeds: string[] = [];
	userFeeds.forEach((value, _) => { feeds.push(value.feedID) });
	const results = await db.select().from(posts).where(inArray(posts.feedID, feeds)).orderBy(desc(posts.publishedAt)).limit(limit);
	return results;
}
