import {getKinAccount, getKinClient} from './init';
import 'express-async-errors'; // handle async/await errors in middleware

const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const winston = require('./config/winston');
const compression = require('compression');
const responseTime = require('response-time');
const indexRouter = require('./routes/index');

export async function createApp() {
	const app = express();
	const client = getKinClient();
	const account = await getKinAccount(client);

	app.use(express.json());
	app.use(express.urlencoded({extended: true}));
	app.use(compression());

	app.use(responseTime());
	app.use(morgan('combined', {stream: winston.stream}));

	app.use('', indexRouter(client, account));

	// catch 404 and forward to error handler
	app.use(function (req: any, res: any, next: any) {
		next(createError(404));
	});

	// error handler
	app.use(function (err: any, req: any, res: any, next: any) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// add this line to include winston logging
		winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

		// render the error page
		res.status(err.status || 500);
		res.render('error');
	});

	return app;
}

