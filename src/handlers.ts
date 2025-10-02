import { readConfig, setUser } from "./config.js";
import { createUser, deleteAllUsers, getAllUsers, getUserByName } from "./lib/db/queries/users.js";
import { fetchFeed } from "./rss.js";

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
