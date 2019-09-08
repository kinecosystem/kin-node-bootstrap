import * as express from "express";
import {Request, Response} from "express-serve-static-core";

import {logger} from "../app";
import {KinBootstrapError} from "../errors";

export const notFoundHandler = function (req: Request, res: Response) {
	res.status(404).send({code: 404, error: "Not found", message: "Not found"});
} as express.RequestHandler;

/**
 * The "next" arg is needed even though it's not used, otherwise express won't understand that it's an error handler
 */
export function generalErrorHandler(err: any, req: Request, res: Response, next: express.NextFunction) {
	if (err.status && err.status < 500) {
		clientErrorHandler(err, req, res);
	} else {
		serverErrorHandler(err, req, res);
	}
}

function clientErrorHandler(error: KinBootstrapError, req: express.Request, res: express.Response) {
	logger.error(`client error (4xx). ERROR: ${error.message}. Exit with error code: ${error.code}`);
	return res.status(error.status).send(error);
}

function serverErrorHandler(error: any, req: express.Request, res: express.Response) {
	let message = `Error
	method: ${req.method}
	path: ${req.url}
	payload: ${JSON.stringify(req.body)}
	`;

	if (error instanceof Error) {
		message += `message: ${error.message}
	stack: ${error.stack}`;
	} else {
		message += `message: ${error.toString()}`;
	}

	logger.error(`server error (5xx)`, {error: message});

	return res.status(500).send({code: 500, error: error.message || "Server error", message: error.message});
}

