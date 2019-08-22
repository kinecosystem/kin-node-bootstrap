import {PaymentTransaction, KinClient, ResourceNotFoundError} from "@kinecosystem/kin-sdk-node";
import {InvalidTransactionError, TransactionNotFoundError} from "../errors";
import {Transaction} from "@kinecosystem/kin-sdk-node/scripts/src/blockchain/horizonModels";

export async function payService(client: KinClient, hash: string): Promise<string> {

	let data: Transaction;
	try {
		data = <PaymentTransaction> await client.getTransactionData(hash);
	} catch (e) {
		if (e instanceof ResourceNotFoundError) {
			throw TransactionNotFoundError(hash);
		} else {
			// @Ron Please let me know if this line is matching your API
			throw InvalidTransactionError();
		}
	}

	// ToDo: add assertion method in Transactions SDK
	if (data.type !== 'PaymentTransaction') {
		throw InvalidTransactionError();
	}

	// Convert from '2018-11-12T06:45:40Z' to unix timestamp
	const timestamp = Date.parse(data.timestamp ? data.timestamp : new Date().toISOString());
	return JSON.stringify({
		source: data.source,
		destination: data.destination,
		amount: data.amount,
		memo: data.memo,
		timestamp: timestamp
	});
}
