import {KinAccount, KinClient, LowBalanceError as KinLowBalanceError, AccountExistsError as KinAccountExistsError} from "@kinecosystem/kin-sdk-node";
import {Create} from "../controllers/create";
import {DestinationExistsError, InvalidTransactionError, LowBalanceError} from "../errors";

export async function createService(client: KinClient, account: KinAccount, params: Create): Promise<string> {
	let transactionId: string;
	try {
		const fee = await client.getMinimumFee();
		const builder = await account.buildCreateAccount({
			address: params.destination,
			startingBalance: params.startingBalance,
			fee: fee,
			memoText: params.memo
		});
		transactionId = await account.submitTransaction(builder);
	} catch (e) {
		if (e instanceof KinLowBalanceError) {
			throw LowBalanceError();
		} else if (e instanceof KinAccountExistsError) {
			throw DestinationExistsError(params.destination);
		} else throw InvalidTransactionError();
	}
	return JSON.stringify({ tx_id: transactionId});
}

