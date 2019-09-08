import {getKinAccount, getKinClient} from './init';
import 'express-async-errors'; // handle async/await errors in middleware
import {ConfigParams, MORGAN_LOG_LEVEL} from "./config/environment";
import {consoleConf} from "./config/logger";
import {generalErrorHandler, notFoundHandler} from "./middlewares";
import * as core from "express-serve-static-core";

const express = require('express');
const morgan = require('morgan');
const express_logger = require('express-logger-unique-req-id');

const compression = require('compression');
const indexRouter = require('./routes/index').indexRouter;
export let logger: any;

export async function createApp(config: ConfigParams): Promise<core.Express> {
	const app = express();
	const client = getKinClient(config);
	const account = await getKinAccount(client, config);

	app.use(express.json());
	app.use(express.urlencoded({extended: true}));
	app.use(compression());
	express_logger.initializeLogger(app, null, consoleConf);
	logger = express_logger.getLogger();
	app.use(morgan(MORGAN_LOG_LEVEL, {stream: logger.stream}));
	app.use('', indexRouter(client, account));
	app.use(notFoundHandler); // catch 404
	app.use(generalErrorHandler); // catch errors
	return app;
}

