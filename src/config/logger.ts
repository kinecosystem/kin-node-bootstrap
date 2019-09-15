import {config} from "./environment";

const appRoot = require('app-root-path');

export const fileConf = {
	level: config.LOGGER.toLocaleLowerCase(),
	filename: `${appRoot}/logs/app.log`,
	handleExceptions: true,
	json: true,
	maxsize: 5242880, // 5MB
	maxFiles: 5,
	colorize: false,
	timestamp: true
};

export const consoleConf = {
	level: config.CONSOLE_LOGGER.toLocaleLowerCase(),
	handleExceptions: true,
	json: false,
	colorize: true,
	timestamp: true
};
