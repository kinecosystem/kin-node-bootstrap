import {InvalidParamError, MissingParamError} from "../errors";
import {MEMO_CAP} from "../config/environment";
import {StrKey} from "@kinecosystem/kin-sdk";

const {check, validationResult} = require('express-validator');

export enum Errors {
	DESTINATION = 'destination',
	AMOUNT = 'amount',
	MEMO = 'memo'
}

export function payValidator(req: any, res: any, next: any) {
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
				case Errors.AMOUNT:
					message = 'Amount for payment must be bigger than 0';
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
		return res.status(selectedError.status).status(selectedError.status).json(selectedError);
	}
	next();
}

export const payRequest = [
	check('destination').exists().custom((destination: string) => {
		if (!StrKey.isValidEd25519PublicKey(destination)) {
			throw new Error();
		}
		return true;
	}),
	check('amount').exists().isFloat({gt: 0}),
	check('memo').optional().isLength({max: MEMO_CAP})
];
