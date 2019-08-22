import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {VERSION} from "../config/config";
import {AccountNotFoundError, LowBalanceError} from "../errors";

export async function getStatusService(client: KinClient, account: KinAccount): Promise<string> {
	try {
		throw Error ();
	} catch (e) {
		throw LowBalanceError();
	}
	//
	// const balance = await account.getBalance();
	// const channelsStatus = account.channelsPool ? account.channelsPool.status : {
	// 	totalChannels: undefined,
	// 	freeChannels: undefined,
	// 	busyChannels: undefined
	// };
	// return JSON.stringify({
	// 	service_version: VERSION,
	// 	horizon: client.environment.url,
	// 	app_id: account.appId,
	// 	public_address: account.publicAddress,
	// 	balance: balance,
	// 	channels: {
	// 		free_channels: channelsStatus.freeChannels,
	// 		non_free_channels: channelsStatus.busyChannels,
	// 		total_channels: channelsStatus.totalChannels
	// 	}
	// });
}
