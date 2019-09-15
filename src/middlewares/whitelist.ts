import {InvalidParamError, MissingParamError} from "../errors";
import {MEMO_CAP} from "../config/environment";

const {check, validationResult} = require('express-validator');

export enum Errors {
	ENVELOPE = 'envelope',
	NETWORK_ID = 'network_id'
}

export function whitelistValidator(req: any, res: any, next: any) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = errors.errors[0];
		let selectedError;
		if (!error.value) {
			selectedError = MissingParamError(`The parameter '${error.param}' was missing from the requests body`);
		} else {
			selectedError = InvalidParamError(`Something went wrong with '${error.value}'`);
		}
		return res.status(selectedError.status).json(selectedError);
	}
	next();
}

export const WhitelistRequest = [
	check('envelope').exists(),
	check('network_id').exists().isString()
];
