import { duration } from "drizzle-orm/gel-core";
import { feeds, users } from "./lib/db/schema";

// feeds is the table object in schema.ts
export type Feed = typeof feeds.$inferSelect;
// users is the table object in schema.ts
export type User = typeof users.$inferSelect;

export async function printFeed(feed: Feed, user: User) {
	console.log("FEED");
	console.log(`feed id => ${feed.id}`);
	console.log(`feed name => ${feed.name}`);
	console.log(`feed url => ${feed.url}`);
	console.log(`created at => ${feed.createdAt}`);
	console.log(`updated at => ${feed.updatedAt}`);
	console.log("\nUSER");
	console.log(`user id => ${user.id}`);
	console.log(`user name => ${user.name}`);
	console.log(`created at => ${user.createdAt}`);
	console.log(`updated at => ${user.updatedAt}`);
}

// custom type
export type FeedUser = {
	feedName: string;
	feedURL: string;
	userName: string;
}
export function printFeedUser(feedUser: FeedUser[]) {
	const lineSep = "=".repeat(40) + "\n";
	feedUser.forEach((value, _) => {
		console.log(lineSep);
		console.log(`feed name: ${value.feedName}`);
		console.log(`feed url: ${value.feedURL}`);
		console.log(`added by: ${value.userName}`);
	});
	console.log(lineSep);
}

export function parseDuration(durationStr: string): number {
	try {
		const regex = /^(\d+)(ms|s|m|h)$/;
		const match = durationStr.match(regex);
		if (!match) {
			throw new Error(`duration string "${durationStr}" is invalid!`);
		}
		console.log(`Collecting feeds every ${durationStr}`);
		// Convert to milliseconds
		if (durationStr.endsWith("s")) {
			return parseInt(match.join("")) * 1000;
		}
		if (durationStr.endsWith("m")) {
			return parseInt(match.join("")) * 1000 * 60;
		}
		if (durationStr.endsWith("h")) {
			return parseInt(match.join("")) * 1000 * 60 * 60;
		}
		// We will assume if not above then it's in ms
		return parseInt(match.join(""));
	} catch (error) {
		console.log(`Failed trying to get duration`);
		throw error;
	}
}
