import {config} from "./environment";

export const consoleConf = {
	level: config.CONSOLE_LOGGER.toLocaleLowerCase(),
	handleExceptions: true,
	json: false,
	colorize: true,
	timestamp: true
};
