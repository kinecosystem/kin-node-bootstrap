import {KinAccount, KinClient, LowBalanceError as KinLowBalanceError} from "@kinecosystem/kin-sdk-node";
import {Pay} from "../controllers/pay";
import {AccountNotFoundError} from "@kinecosystem/kin-sdk-node/scripts/bin/errors";
import {DestinationDoesNotExistError, InvalidTransactionError, LowBalanceError} from "../errors";

export type PayRes = {
	tx_id: string
}

export async function payService(client: KinClient, account: KinAccount, params: Pay): Promise<PayRes> {
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
		if (e.type === 'ResourceNotFoundError') {
			throw DestinationDoesNotExistError(params.destination);
		} else if (e instanceof KinLowBalanceError) {
			throw LowBalanceError();
		} else {
			throw e;
		}
	}
	return { tx_id: transactionId};
}
