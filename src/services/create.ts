import {KinAccount, KinClient, LowBalanceError as KinLowBalanceError, AccountExistsError as KinAccountExistsError} from "@kinecosystem/kin-sdk-node";
import {Create} from "../controllers/create";
import {DestinationExistsError, InvalidTransactionError, LowBalanceError} from "../errors";

export type CreateRes = {
	tx_id: string
}

export async function createAccountService(client: KinClient, account: KinAccount, params: Create): Promise<CreateRes> {
	let transactionId: string;
	try {
		const fee = await client.getMinimumFee();
		const builder = await account.buildCreateAccount({
			address: params.destination,
			startingBalance: params.starting_balance,
			fee: fee,
			memoText: params.memo
		});
		transactionId = await account.submitTransaction(builder);
	} catch (e) {
		if (e instanceof KinLowBalanceError) {
			throw LowBalanceError();
		} else if (e instanceof KinAccountExistsError) {
			throw DestinationExistsError(params.destination);
		} else {
			throw e;
		}
	}
	return { tx_id: transactionId};
}

