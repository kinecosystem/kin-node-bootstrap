import {InvalidParamError, MissingParamError} from "../errors";
import {StrKey} from "@kinecosystem/kin-sdk";

const {check, validationResult} = require('express-validator');

export function balanceValidator(req: any, res: any, next: any) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = errors.errors[0];
		let selectedError;
		if (!error.value) {
			selectedError = MissingParamError(`The parameter '${error.param}' was missing from the requests body`);
		} else {
			selectedError = InvalidParamError(`Transaction hash '${error.value}' is not a valid transaction hash`);
		}
		return res.status(selectedError.status).json(selectedError);
	}
	next();
}
// without decode check
export const balanceRequest = [
	check('address').custom((address: string) => {
		if (!StrKey.isValidEd25519PublicKey(address)) {
			throw new Error();
		}
		return true;
	}).exists()
];
