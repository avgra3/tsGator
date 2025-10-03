export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = {
	commands: Record<string, CommandHandler>;
};

// Create registry
export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): CommandsRegistry {
	registry.commands[cmdName] = handler;
	return registry;
}

// Run commands
export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
	// Run a command if it exists
	if (cmdName in registry.commands) {
		try {
			await registry.commands[cmdName](cmdName, ...args)
		} catch (error) {
			throw new Error(`ERROR: Running command "${cmdName}" raised an error.\n${error}`);
			return
		}
	} else {
		console.log(`WARNING: command "${cmdName} does not exist"`);
	}
}

