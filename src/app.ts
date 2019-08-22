import {getKinAccount, getKinClient} from './init';
import 'express-async-errors'; // handle async/await errors in middleware
export {};

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');
const winston = require('./config/winston');
const helmet = require('helmet');
const compression = require('compression');
const responseTime = require('response-time');
const indexRouter = require('./routes/index');

const app = express();

const client = getKinClient();
exports.appPromise = getKinAccount(client).then((account: any) => {
	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');

	app.use(express.json());
	app.use(express.urlencoded({extended: true}));
	app.use(helmet());
	app.use(compression());
	app.use(express.static(path.join(__dirname, 'public')));

	app.use(responseTime());
	app.use(morgan('combined', {stream: winston.stream}));

	app.use('/', indexRouter(client, account));

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

	const port = process.env.PORT || 3000;
	app.listen(port, () => console.log(`Listening on port ${port}...`));

});
