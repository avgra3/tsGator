import { readConfig, setUser } from "./config.js";
import { createFeed, getFeedByUrl, getFeeds } from "./lib/db/queries/feeds.js";
import { createUser, deleteAllUsers, getAllUsers, getUserByID, getUserByName, getUsersByIDs } from "./lib/db/queries/users.js";
import { parseDuration, printFeed, printFeedUser, User } from "./helpers.js";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/feedFollow.js";
import { scrapeFeeds } from "./aggregator.js";
import { getPostsForUser } from "./lib/db/queries/posts.js";

// Handlers
export async function handlerLogin(cmdName: string, userName: string, ...args: string[]) {
	const currentConfig = readConfig();
	try {
		setUser(userName, currentConfig)
	} catch (error) {
		throw error;
	}
	const updatedConfig = readConfig();
	const existingUsers = await getUserByName(updatedConfig.currentUserName);
	if (existingUsers.length === 0) {
		throw Error("ERROR: User does not exist!");
	}
	console.log("Username has been set!");
}

export async function handlerCreateUser(cmdName: string, userName: string, ...args: string[]) {
	try {
		await createUser(userName);
	} catch (error) {
		throw new Error(`ERROR: Occured while trying to insert => ${error}`);
	}
	const currentConfig = readConfig();
	try {
		setUser(userName, currentConfig);
	} catch (error) {
		throw error;
	}
}

export async function handlerGetUserByName(cmdName: string, userName: string, ...args: string[]) {
	try {
		const createdUser = await getUserByName(userName);
		return createdUser;
	} catch (error) {
		throw new Error(`ERROR: Occured while trying to select name="${userName}"`);
	}
}

export async function handlerResetUserTable(cmdName: string, ...args: string[]) {
	try {
		await deleteAllUsers();
	} catch (error) {
		throw new Error(`ERROR: Occured while trying to reset users table.`);
	}
}

export async function handlerGetUsers(cmdName: string, ...args: string[]) {
	try {
		const currentConfig = readConfig();
		const loggedInUser = currentConfig.currentUserName;
		const allUsers = await getAllUsers();
		allUsers.forEach((value, _) => {
			let message = `* ${value.name}`;
			if (value.name === loggedInUser) {
				message += ` (current)`;
			}
			console.log(message);
		});
	} catch (error) { throw error; }
}

export async function handlerBrowse(cmdName: string, user: User, limit: string = "2", ...args: string[]) {
	try {
		const limitInteger = parseInt(limit);
		const posts = await getPostsForUser(user, limitInteger);
		posts.forEach((value, _) => {
			console.log("==========================");
			console.log(value.title);
			console.log(value.description);
			console.log(value.publishedAt);
			console.log(`Read the full article: ${value.url}`);
		});
		console.log("==========================");
	} catch (error) { throw error; }
}

export async function handlerAgg(cmdName: string, time_between_reqs: string, ...args: string[]) {
	const duration = parseDuration(time_between_reqs);
	scrapeFeeds();
	console.log(`duration => ${duration}`);
	const interval = setInterval(() => {
		scrapeFeeds();
	}, duration);
	await new Promise<void>((resolve) => {
		process.on("SIGINT", () => {
			console.log("Shutting down feed aggregator...");
			clearInterval(interval);
			resolve();
		})
	});
}

export async function handlerAddFeed(cmdName: string, user: User, feedName: string, feedUrl: string, ...args: string[]) {
	try {
		const newFeed = await createFeed(user.id, feedName, feedUrl);
		const feedID = newFeed.id;
		await createFeedFollow(user.id, feedID);
		printFeed(newFeed, user);
	} catch (error) {
		throw error;
	}
}

export async function handlerListFeeds(cmdName: string, ...args: string[]) {
	const feedList = await getFeeds();
	if (feedList.length > 0) {
		printFeedUser(feedList);
	} else {
		console.log("No feeds!");
	}
}

export async function handlerFollow(cmdName: string, user: User, feedUrl: string, ...args: string[]) {
	const feedInfo = await getFeedByUrl(feedUrl);
	if (typeof feedInfo === "undefined") {
		throw new Error(`Url provided (${feedUrl}) is not in feeds`);
	}
	try {
		const createdFeedFollow = await createFeedFollow(user.id, feedInfo.id);
		console.log(`Feed: ${createdFeedFollow.feedName} by user ${createdFeedFollow.userName}`);
	} catch (error) { throw error; }
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
	const followedFeeds = await getFeedFollowsForUser(user.id);
	followedFeeds.forEach((value, _) => {
		console.log("========================");
		console.log(`Feed: ${value.feedName}`);
		console.log(`Added by: ${value.addedBy}`);
	});
	console.log("========================");
}

export async function handlerDeleteFeedFollow(cmdName: string, user: User, feedUrl: string, ...args: string[]) {
	const feed = await getFeedByUrl(feedUrl);
	if (typeof feed === "undefined") {
		throw new Error(`The feed "${feedUrl}" does not exist!`);
	}
	if (feed.user_id !== user.id) {
		throw new Error(`You do not have permission to delete someone else's feed!`)
	}
	try {
		const deleted = await deleteFeedFollow(user.id, feed.id);
		deleted.forEach((value, _) => {
			console.log(`Deleted feed => ${value.id}`);
		});
	} catch (error) { throw error; }
}

