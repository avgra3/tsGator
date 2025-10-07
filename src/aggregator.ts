import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { createPost } from "./lib/db/queries/posts";
import { fetchFeed } from "./rss";

export async function scrapeFeeds() {
	try {
		const feeds = await getNextFeedToFetch();
		for (let feed of feeds) {
			console.log("===========================");
			await markFeedFetched(feed.id);
			const currentFeed = await fetchFeed(feed.url);
			for (const item of currentFeed.channel.item) {
				console.log(`title: ${item.title}`);
				console.log(`pub date: ${item.pubDate}`);
				await createPost(item.title, item.link, feed.id, item.pubDate, item.description);
			}
		}
		console.log("====================================");
	} catch (error) {
		console.log("Failed in scrapeFeeds");
		throw error;
	}
}

