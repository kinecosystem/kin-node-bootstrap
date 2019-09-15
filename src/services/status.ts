import {KinAccount, PaymentTransaction, ResourceNotFoundError} from "@kinecosystem/kin-sdk-node";
import {TransactionNotFoundError} from "../errors";

export async function getStatusService(account: KinAccount): Promise<number> {
	try {
		return await account.getBalance();
	} catch (e) {
		throw e;
	}
}
