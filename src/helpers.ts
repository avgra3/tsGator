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
