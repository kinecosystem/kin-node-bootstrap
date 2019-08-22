
export type ApiError = {
	code: number;
	http_code: number;
	message: string;
};

/**
 * Code additions (/postfix) to be added to the http status code per error.
 * The concatenation is done in the MarketplaceError ctor.
 */
const CODES = {
	NotFound: {
		AccountNotFoundError: 1,
		TransactionNotFoundError: 2
	},
	BadRequest: {
		InvalidParamError: 1,
		DestinationDoesNotExistError: 2,
		LowBalanceError: 3,
		InvalidTransactionError: 4,
		CantDecodeTransactionError: 5,
		DestinationExistsError: 9
	}
};

export class KinSdkError extends Error {
	public readonly title: string;
	public readonly status: number; // http status code
	public readonly http_code: number; // external codes
	public readonly code: number; // our own internal codes

	constructor(status: number, index: number, title: string, message: string) {
		super();
		this.http_code = status;
		this.code = Number(status + "" + index);
		this.title = title;
		this.status = status;
		this.message = message;
	}

	public toJson(): ApiError {
		return {
			code: this.code,
			http_code: this.http_code,
			message: this.message
		};
	}

	public toString(): string {
		return JSON.stringify(this.toJson());
	}
}

function BadRequestError(index: number, message: string) {
	return new KinSdkError(400, index, "Bad Request", message);
}

function NotFoundError(index: number, message: string) {
	return new KinSdkError(404, index, "Not Found", message);
}

export function InvalidParamError(message: string) {
	return BadRequestError(CODES.BadRequest.InvalidParamError, message);
}

export function InvalidTransactionError() {
	return BadRequestError(CODES.BadRequest.InvalidTransactionError, 'The specified transaction was not a valid kin payment transaction');
}

export function CantDecodeTransactionError() {
	return BadRequestError(CODES.BadRequest.InvalidTransactionError, 'The service was unable to decode the received transaction envelope');
}

export function DestinationDoesNotExistError(destination: string) {
	return BadRequestError(CODES.BadRequest.DestinationDoesNotExistError, `Transaction ${destination} was not found`);
}

export function LowBalanceError() {
	return BadRequestError(CODES.BadRequest.LowBalanceError, 'The account does not have enough kin to perform this operation');
}

export function DestinationExistsError(destination: string) {
	return BadRequestError(CODES.BadRequest.DestinationExistsError, `Destination ${destination} already exists`);
}

export function AccountNotFoundError(accountId: string) {
	return NotFoundError(CODES.NotFound.AccountNotFoundError, `Account ${accountId} was not found`);
}

export function TransactionNotFoundError(transaction: string) {
	return NotFoundError(CODES.NotFound.TransactionNotFoundError, `Transaction ${transaction} was not found`);
}
