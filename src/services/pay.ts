import {KinAccount, KinClient, LowBalanceError as KinLowBalanceError} from "@kinecosystem/kin-sdk-node";
import {Pay} from "../controllers/pay";
import {AccountNotFoundError} from "@kinecosystem/kin-sdk-node/scripts/bin/errors";
import {DestinationDoesNotExistError, InvalidTransactionError, LowBalanceError} from "../errors";

export async function payService(client: KinClient, account: KinAccount, params: Pay): Promise<string> {
	const fee = await client.getMinimumFee();
	let transactionId: string;
	try {
		const builder = await account.buildSendKin({
			address: params.destination,
			amount: params.amount,
			fee: fee,
			memoText: params.memo
		});
		transactionId = await account.submitTransaction(builder);
	} catch (e) {
		if (e instanceof AccountNotFoundError) {
			throw DestinationDoesNotExistError(params.destination);
		} else if (e instanceof KinLowBalanceError) {
			throw LowBalanceError();
		} else throw InvalidTransactionError();
	}
	return JSON.stringify({ tx_id: transactionId});
}
