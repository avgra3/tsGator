import { readConfig, setUser } from "./config.js";
import { createFeed, getFeedByUrl, getFeeds } from "./lib/db/queries/feeds.js";
import { createUser, deleteAllUsers, getAllUsers, getUserByID, getUserByName, getUsersByIDs } from "./lib/db/queries/users.js";
import { fetchFeed } from "./rss.js";
import { printFeed, printFeedUser, User } from "./helpers.js";
import { createFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/feedFollow.js";

// Handlers
export async function handlerLogin(cmdName: string, ...args: string[]) {
	if (typeof args === "undefined" || args[0] === "" || args.length === 0) {
		throw new Error(`ERROR: ${cmdName} requires a username argument!`);
	}
	const currentConfig = readConfig();
	try {
		setUser(args[0], currentConfig)
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

export async function handlerCreateUser(cmdName: string, ...args: string[]) {
	if (typeof args === "undefined" || args[0].trim() === "" || args.length === 0) {
		throw new Error(`ERROR: ${cmdName} requires a username argument!`);
	}
	const name = args[0].trim();
	// console.log(`NAME => ${name}`);
	try {
		// const createdUser =
		await createUser(name);
		// console.log(`Successfully created: ${createdUser.name}`);
	} catch (error) {
		throw new Error(`ERROR: Occured while trying to insert => ${error}`);
	}
	const currentConfig = readConfig();
	try {
		setUser(name, currentConfig);
	} catch (error) {
		throw error;
	}
}

export async function handlerGetUserByName(cmdName: string, ...args: string[]) {
	if (typeof args === "undefined" || args[0] === "") {
		throw new Error(`ERROR: ${cmdName} requires a username argument!`);
	}
	const name = args[0];
	try {
		const createdUser = await getUserByName(name);
		return createdUser;
	} catch (error) {
		throw new Error(`ERROR: Occured while trying to select name="${name}"`);
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

export async function handlerAgg(cmdName: string, ...args: string[]) {

	// if (typeof args === "undefined" || args[0] === "") {
	// 	throw new Error(`ERROR: ${cmdName} requires a RSS URL argument!`);
	// }
	// const feedUrl = args[0];
	const feedUrl = "https://www.wagslane.dev/index.xml";
	try {
		const fetchedFeed = await fetchFeed(feedUrl);
		const channel = fetchedFeed.channel;
		const items = channel.item;
		console.log(`Title => ${channel.title}`);
		console.log(`Link => ${channel.link}`);
		console.log(`Description => ${channel.description}`);
		items.forEach((value, _) => {
			console.log(`title: ${value.title}`);
			console.log(`- link: ${value.link}`);
			console.log(`- description: ${value.description}`);
			console.log(`- pubDate: ${value.pubDate}`);
			console.log("\n");
		});
	} catch (error) { throw error; }
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
	if (typeof args === "undefined" || args.length < 2) {
		throw new Error(`ERROR: ${cmdName} requires a "name" and "url" argument!`);
	}
	const currentConfig = readConfig();
	const userName = currentConfig.currentUserName;
	const user = await getUserByName(userName);
	const userID = user[0].id;
	const feedName = args[0];
	const feedUrl = args[1];

	try {
		const newFeed = await createFeed(userID, feedName, feedUrl);
		printFeed(newFeed, user[0]);
		const feedID = newFeed.id;
		const newFeedFollow = await createFeedFollow(userID, feedID);
		printFeed(newFeed, user[0]);

	} catch (error) {
		throw error;
	}
}

export async function handlerListFeeds(cmdName: string, ...args: string[]) {
	// Name of feed
	// Url of feed
	// User who created the feed
	const feedList = await getFeeds();
	if (feedList.length > 0) {
		printFeedUser(feedList);
	} else {
		console.log("No feeds!");
	}
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
	if (args.length < 1) {
		throw new Error(`Follow command takes a "url" argument and none was supplied.`);
	}
	const url = args[0];
	const currentConfig = readConfig();
	const currentUser = await getUserByName(currentConfig.currentUserName);
	const feedInfo = await getFeedByUrl(url);
	try {
		const createdFeedFollow = await createFeedFollow(currentUser[0].id, feedInfo.id);
		console.log(`Feed: ${createdFeedFollow.feedName} by user ${createdFeedFollow.userName}`);
	} catch (error) { throw error; }
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
	const currentConfig = readConfig();
	const currentUser = await getUserByName(currentConfig.currentUserName);
	const followedFeeds = await getFeedFollowsForUser(currentUser[0].id);
	followedFeeds.forEach((value, _) => {
		console.log("========================");
		console.log(`Feed: ${value.feedName}`);
		console.log(`Added by: ${value.addedBy}`);
	});
	console.log("========================");
}
