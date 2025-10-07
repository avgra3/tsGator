import { argv } from "process";
import { CommandsRegistry, registerCommand, registry, runCommand, } from "./command.js";
import { handlerAgg, handlerLogin, handlerCreateUser, handlerResetUserTable, handlerGetUsers, handlerAddFeed, handlerListFeeds, handlerFollow, handlerFollowing, handlerGetUserByName } from "./handlers.js";
import { middlewareLoggedIn } from "./middleware.js";

async function main() {
	registerCommand(registry, "login", handlerLogin);
	registerCommand(registry, "register", handlerCreateUser);
	registerCommand(registry, "reset", handlerResetUserTable);
	registerCommand(registry, "users", handlerGetUsers);
	registerCommand(registry, "agg", handlerAgg);
	registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
	registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
	registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
	//
	// const commandsRegistry: CommandsRegistry = {
	// 	commands: {
	// 		login: handlerLogin,
	// 		register: handlerCreateUser,
	// 		reset: handlerResetUserTable,
	// 		users: handlerGetUsers,
	// 		agg: handlerAgg,
	// 		addfeed: handlerAddFeed,
	// 		feeds: handlerListFeeds,
	// 		follow: handlerFollow,
	// 		following: handlerFollowing,
	// 	}
	// };
	const args: string[] = argv.slice(3);
	let command: string = argv[2];
	if (typeof command === "undefined") {
		console.log("No command supplied. Exiting");
	} else {
		try {
			await runCommand(registry, command, ...args);
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	}
	process.exit(0);
}

main();
