import {
	KinAccount,
	KinClient,
	LowBalanceError as KinLowBalanceError,
	AccountExistsError as KinAccountExistsError
} from "@kinecosystem/kin-sdk-node";
import {Create} from "../controllers/create";
import {DestinationExistsError, LowBalanceError} from "../errors";

export async function createAccountService(client: KinClient, account: KinAccount, params: Create): Promise<string> {
	try {
		const fee = await client.getMinimumFee();
		return await account.channelsPool!!.acquireChannel(async channel => {
			const builder = await account.buildCreateAccount({
				address: params.destination,
				startingBalance: params.starting_balance,
				fee: fee,
				memoText: params.memo,
				channel: channel
			});
			return await account.submitTransaction(builder);
		});
	} catch (e) {
		if (e instanceof KinLowBalanceError) {
			throw LowBalanceError();
		} else if (e instanceof KinAccountExistsError) {
			throw DestinationExistsError(params.destination);
		} else {
			throw e;
		}
	}
}

