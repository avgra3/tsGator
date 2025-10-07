import { CommandHandler } from "./command.js";
import { readConfig } from "./config.js";
import { User } from "./helpers.js";
import { getUserByName } from "./lib/db/queries/users.js";

type UserCommandHandler = (
	cmdName: string,
	user: User,
	...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export const middlewareLoggedIn: middlewareLoggedIn = (handler) => {
	return async (cmdName, ...args) => {
		const config = readConfig();
		const userName = config.currentUserName;
		if (!userName) {
			throw new Error("No user logged in!");
		}
		const [user] = await getUserByName(userName);
		if (!user) {
			throw new Error(`User "${userName}" not found!`);
		}
		await handler(cmdName, user, ...args);
	}
}
