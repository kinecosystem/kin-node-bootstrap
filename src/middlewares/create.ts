import {InvalidParamError, MissingParamError} from "../errors";
import {MEMO_CAP} from "../config/environment";
import {StrKey} from "@kinecosystem/kin-sdk";

const {check, validationResult} = require('express-validator');

enum Errors {
	DESTINATION = 'destination',
	STARTING_BALANCE = 'starting_balance',
	MEMO = 'memo'
}

export function createValidator(req: any, res: any, next: any) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const error = errors.errors[0];
		let selectedError;
		if (!error.value) {
			selectedError = MissingParamError(`The parameter '${error.param}' was missing from the requests body`);
		} else {
			let message;
			switch (errors.errors[0].param) {
				case Errors.DESTINATION:
					message = `Destination '${error.value}' is not a valid public address`;
					break;
				case Errors.STARTING_BALANCE:
					message = 'Starting balance for account creation must not be negative';
					break;
				case Errors.MEMO:
					message = `Memo: '${error.value}' is longer than ${MEMO_CAP}`;
					break;
				default:
					message = error.msg;
					break;
			}
			selectedError = InvalidParamError(message);
		}
		return res.status(selectedError.status).json(selectedError);
	}
	next();
}

export const createRequest = [
	check('destination').exists().isLength({min: 56}).custom((destination: string) => {
		if (!StrKey.isValidEd25519PublicKey(destination)) {
			throw new Error();
		}
		return true;
	}),
	check('starting_balance').exists().isFloat({gt: 0}),
	check('memo').optional().isLength({max: MEMO_CAP})
];
