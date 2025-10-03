import { argv } from "process";
import { CommandsRegistry, runCommand, } from "./command.js";
import { handlerAgg, handlerLogin, handlerCreateUser, handlerResetUserTable, handlerGetUsers, handlerAddFeed, handlerListFeeds } from "./handlers.js";

async function main() {
	const commandsRegistry: CommandsRegistry = {
		commands: {
			login: handlerLogin,
			register: handlerCreateUser,
			reset: handlerResetUserTable,
			users: handlerGetUsers,
			agg: handlerAgg,
			addfeed: handlerAddFeed,
			feeds: handlerListFeeds,
		}
	};
	const args: string[] = argv.slice(3);
	let command: string = argv[2];
	if (typeof command === "undefined") {
		console.log("No command supplied. Exiting");
	} else {
		try {
			await runCommand(commandsRegistry, command, ...args);
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	}
	process.exit(0);
}

main();
