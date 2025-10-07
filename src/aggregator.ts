import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { fetchFeed } from "./rss";

export async function scrapeFeeds() {
	try {
		const feeds = await getNextFeedToFetch();
		for (let feed of feeds) {
			await markFeedFetched(feed.id);
			const currentFeed = await fetchFeed(feed.url);
			for (const item of currentFeed.channel.item) {
				console.log(`title: ${item.title}`);
			}
		}
	} catch (error) {
		console.log("Failed in scrapeFeeds");
		throw error;
	}
}

