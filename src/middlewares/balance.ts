import {InvalidParamError} from "../errors";

const {check, validationResult} = require('express-validator');

export function balanceValidator(req: any, res: any, next: any) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const value =  errors && errors.errors[0] ? errors.errors[0].value : '';
		const selectedError = InvalidParamError(`Transaction hash '${value}' is not a valid transaction hash`);
		return res.json({
			http_code: selectedError.http_code,
			code: selectedError.code,
			message: selectedError.message
		});
	}
	next();
}
// without decode check
export const balanceRequest = [check('address').isLength({min: 56})];
