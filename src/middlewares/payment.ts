import {InvalidParamError} from "../errors";

const {check, validationResult} = require('express-validator');

export function paymentValidator(req: any, res: any, next: any) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const selectedError = InvalidParamError(`Transaction hash ${errors.errors[0].value} is not a valid transaction hash`);
		return res.status(selectedError.status).json(selectedError);
	}
	next();
}

export const PaymentRequest = [check('hash').isLength({min: 64}).isHexadecimal()];
