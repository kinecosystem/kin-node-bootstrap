import {PaymentTransaction, KinClient, ResourceNotFoundError} from "@kinecosystem/kin-sdk-node";
import {TransactionNotFoundError} from "../errors";

export async function paymentService(client: KinClient, hash: string): Promise<any> {
	try {
		return <PaymentTransaction> await client.getTransactionData(hash);
	} catch (e) {
		if (e instanceof ResourceNotFoundError) {
			throw TransactionNotFoundError(hash);
		} else {
			throw e;
		}
	}
}
