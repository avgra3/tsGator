import { argv } from "process";
import { CommandsRegistry, runCommand, } from "./command.js";
import { handlerAgg, handlerLogin, handlerCreateUser, handlerResetUserTable, handlerGetUsers } from "./handlers.js";

async function main() {
	const commandsRegistry: CommandsRegistry = {
		commands: {
			login: handlerLogin,
			register: handlerCreateUser,
			reset: handlerResetUserTable,
			users: handlerGetUsers,
			agg: handlerAgg,
		}
	};
	// for (const key in commandsRegistry.commands) {
	// 	console.log(`- key: ${key}`);
	// };
	const allArgs = argv;
	const args: string[] = allArgs.slice(3);
	let command: string = allArgs[2];
	// console.log(`=> command: ${command}`);
	// console.log("=> args:");
	// args.forEach((value, index) => {
	// 	console.log(`- [${index}] => ${value}`);
	// });
	if (typeof command === "undefined") {
		console.log("No command supplied. Exiting");
	} else {
		try {
			await runCommand(commandsRegistry, command, args.join(" "));
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	}
	process.exit(0);
}

main();
