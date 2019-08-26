import {PaymentTransaction, KinClient, ResourceNotFoundError} from "@kinecosystem/kin-sdk-node";
import {InvalidTransactionError, TransactionNotFoundError, InternalServerError} from "../errors";
import {Transaction} from "@kinecosystem/kin-sdk-node/scripts/src/blockchain/horizonModels";

export type PaymentRes = {
		source: string,
		destination: string,
		amount: number,
		memo?: string,
		timestamp: number
	}

export async function paymentService(client: KinClient, hash: string): Promise<PaymentRes> {

	let data: Transaction;
	try {
		data = <PaymentTransaction> await client.getTransactionData(hash);
	} catch (e) {
		if (e instanceof ResourceNotFoundError) {
			throw TransactionNotFoundError(hash);
		} else {
			throw InternalServerError();
		}
	}

	if (data.type !== 'PaymentTransaction') {
		throw InvalidTransactionError();
	}

	// Convert from '2018-11-12T06:45:40Z' to unix timestamp
	const timestamp = Date.parse(data.timestamp ? data.timestamp : new Date().toISOString());
	return {
		source: data.source,
		destination: data.destination,
		amount: data.amount,
		memo: data.memo,
		timestamp: timestamp
	};
}
