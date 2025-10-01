import { argv, exit } from "process";
import { CommandsRegistry, registerCommand, handlerLogin, runCommand } from "./command.js";

function main() {
	let commandsRegistry: CommandsRegistry = { commands: {} };
	commandsRegistry = registerCommand(commandsRegistry, "login", handlerLogin);
	const allArgs = argv;
	const args: string[] = allArgs.slice(3);
	let command: string = allArgs[2];
	if (typeof command === "undefined") {
		console.error("ERROR: You must supply a command!");
		exit(1);
	}
	try {
		runCommand(commandsRegistry, command, args.join(" "));
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("ERROR:", error.message);
		} else {
			console.error("ERROR: An unknown error occured!", error);
		}
		exit(1);
	}
}


main();
