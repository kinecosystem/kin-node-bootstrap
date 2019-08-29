import {KinClient} from "@kinecosystem/kin-sdk-node";
import {paymentService} from "../services/payment";
import {InvalidTransactionError} from "../errors";

export type PaymentRes = {
	source: string,
	destination: string,
	amount: number,
	memo?: string,
	timestamp: number
}

export type GetPayment = Request & {
	params: {
		hash: string;
	}
};

/**
 * Get a status of a payment by transaction's hash
 * @returns {PaymentRes}
 */
export async function getPayment(client: KinClient, hash: string): Promise<PaymentRes> {
	const data = await paymentService(client, hash);
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
