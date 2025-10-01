import { readConfig, setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = {
	commands: Record<string, CommandHandler>;
};

// Create registry
export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): CommandsRegistry {
	registry.commands[cmdName] = handler;
	return registry;
}

// Run commands
export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
	// Run a command if it exists
	if (cmdName in registry.commands) {
		registry.commands[cmdName](cmdName, args.join(" "))
		return
	}
	console.log(`WARNING: command "${cmdName} does not exist"`);
}

// Handlers
export function handlerLogin(cmdName: string, ...args: string[]) {
	if (typeof args === "undefined" || args[0] === "") {
		throw new Error(`ERROR: ${cmdName} requires a username argument!`);
	}
	const currentConfig = readConfig();
	try {
		setUser(args[0], currentConfig)
	} catch (error) {
		console.log(error);
		return
	}
	console.log("Username has been set!");
}
