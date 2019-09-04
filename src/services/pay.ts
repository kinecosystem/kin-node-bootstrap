import {KinAccount, KinClient, LowBalanceError as KinLowBalanceError} from "@kinecosystem/kin-sdk-node";
import {Pay} from "../controllers/pay";
import {DestinationDoesNotExistError, LowBalanceError} from "../errors";

export async function payService(client: KinClient, account: KinAccount, params: Pay): Promise<string> {
	const fee = await client.getMinimumFee();
	try {
		return await account.channelsPool!!.acquireChannel(async channel => {
			const builder = await account.buildSendKin({
				address: params.destination,
				amount: params.amount,
				fee: fee,
				memoText: params.memo,
				channel: channel
			});
			return await account.submitTransaction(builder);
		});
	} catch (e) {
		if (e.type === 'ResourceNotFoundError') {
			throw DestinationDoesNotExistError(params.destination);
		} else if (e instanceof KinLowBalanceError) {
			throw LowBalanceError();
		} else {
			throw e;
		}
	}
}
