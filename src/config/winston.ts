import {config} from "./environment";
const appRoot = require('app-root-path');
const winston = require('winston');

const options = {
	file: {
		level: config.LOG_LEVEL.toLocaleLowerCase(),
		filename: `${appRoot}/logs/app.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: true,
	},
	console: {
		level: config.CONSOLE_LEVEL.toLocaleLowerCase(),
		handleExceptions: true,
		json: false,
		colorize: true,
	},
};

const logger = winston.createLogger({
	transports: [
		new (winston.transports.Console)(options.console),
		new (winston.transports.File)(options.file)
	],
	exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
	write: function (message: string, encoding: string) {
		logger.info(message);
	},
};

exports = logger;
