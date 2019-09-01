import {InvalidParamError, MissingParamError} from "../errors";

const {check, validationResult} = require('express-validator');

export function paymentValidator(req: any, res: any, next: any) {
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

export const PaymentRequest = [check('hash').exists().isLength({min: 64}).isHexadecimal()];
