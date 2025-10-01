import { readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

type Config = {
	dbUrl: string;
	currentUserName: string;
}

export function setUser(user: string, config: Config) {
	config.currentUserName = user;
	const configString = JSON.stringify(config);
	const gatorConfigFile = join(homedir(), ".gatorconfig.json");
	try {
		writeFileSync(gatorConfigFile, configString);
	} catch (error) {
		throw new Error(`An error occured! ERROR: ${error}`);
	}
}

export function readConfig(): Config {
	const gatorConfigFile = join(homedir(), ".gatorconfig.json");
	try {
		const gatorConfig = readFileSync(gatorConfigFile, "utf8");
		const gatorConfigJSON = JSON.parse(gatorConfig) as Config;
		return gatorConfigJSON;
	} catch (error) {
		console.log("There was an error!");
		console.log(error);
		throw error;
	}
}
