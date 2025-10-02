import { readConfig, setUser } from "./config.js";
import { createUser, getUserByName } from "./lib/db/queries/users.js";

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
		console.error(`ERROR: Occured while trying to select name="${name}"=>`, error);
	}
}


