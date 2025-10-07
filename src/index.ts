import { argv } from "process";
import { registerCommand, registry, runCommand, } from "./command.js";
import { handlerAgg, handlerLogin, handlerCreateUser, handlerResetUserTable, handlerGetUsers, handlerAddFeed, handlerFollow, handlerFollowing, handlerDeleteFeedFollow, handlerBrowse } from "./handlers.js";
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
	registerCommand(registry, "unfollow", middlewareLoggedIn(handlerDeleteFeedFollow));
	registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));
	const args: string[] = argv.slice(3);
	let command: string = argv[2];
	if (typeof command === "undefined") {
		console.log("No command supplied. Exiting");
	} else if (command === "help") {
		console.log("Available commands\n");
		for (const command in registry.commands) {
			console.log(`- ${command}`);
		}
		console.log();
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
