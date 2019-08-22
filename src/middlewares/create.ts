import {InvalidParamError} from "../errors";
import {MEMO_CAP} from "../config/config";
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
		let msg = error.msg;
		const value = error.value;
		switch (errors.errors[0].param) {
			case Errors.DESTINATION:
				msg = `Destination '${value}' is not a valid public address`;
				break;
			case Errors.STARTING_BALANCE:
				msg = 'Starting balance for account creation must not be negative';
				break;
			case Errors.MEMO:
				msg = `Memo: '${value}' is longer than ${MEMO_CAP}`;
				break;
			default:
				break;
		}
		const selectedError = InvalidParamError(msg);
		return res.json({
			http_code: selectedError.http_code,
			code: selectedError.code,
			title: selectedError.title,
			status: selectedError.status,
			message: selectedError.message
		});
	}
	next();
}

export const createRequest = [
	check('destination').isLength({min: 56}).custom((destination: string) => {
		if (!StrKey.isValidEd25519PublicKey(destination)) {
			throw new Error();
		}
		return true;
	}),
	check('starting_balance').isFloat({gt: 0}),
	check('memo').isLength({max: MEMO_CAP})
];
