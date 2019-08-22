import {InvalidParamError} from "../errors";
import {MEMO_CAP} from "../config/config";
import {StrKey} from "@kinecosystem/kin-sdk";

const {check, validationResult} = require('express-validator');

enum Errors {
	DESTINATION = 'destination',
	AMOUNT = 'amount',
	MEMO = 'memo'
}

export function payValidator(req: any, res: any, next: any) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const error = errors.errors[0];
		let msg = error.msg;
		const value = error.value;
		switch (errors.errors[0].param) {
			case Errors.DESTINATION:
				msg = `Destination '${value}' is not a valid public address`;
				break;
			case Errors.AMOUNT:
				msg = 'Amount for payment must be bigger than 0';
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

export const payRequest = [
	check('destination').isLength({min: 56}).custom((destination: string) => {
		if (!StrKey.isValidEd25519PublicKey(destination)) {
			throw new Error();
		}
		return true;
	}),
	check('amount').isFloat({gt: 0}),
	check('memo').isLength({max: MEMO_CAP})
];
