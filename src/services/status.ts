import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {VERSION} from "../config/config";

export type StatusRes = {
		service_version: string,
		horizon: string,
		app_id: string,
		public_address: string,
		balance: number,
		channels: {
			free_channels?: number,
			non_free_channels?: number,
			total_channels?: number
		}
	}
export async function getStatusService(client: KinClient, account: KinAccount): Promise<StatusRes> {
	const balance = await account.getBalance();
	const channelsStatus = account.channelsPool ? account.channelsPool.status : {
		totalChannels: undefined,
		freeChannels: undefined,
		busyChannels: undefined
	};
	return {
		service_version: VERSION,
		horizon: client.environment.url,
		app_id: account.appId,
		public_address: account.publicAddress,
		balance: balance,
		channels: {
			free_channels: channelsStatus.freeChannels,
			non_free_channels: channelsStatus.busyChannels,
			total_channels: channelsStatus.totalChannels
		}
	};
}
