import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {whitelistService} from "../services/whitelist";

export type Whitelist= Request &  {
		envelope: string,
		network_id: string
	};

/**
 * Get a status of the account
 * @returns {string}
 */
export async function whitelist(client: KinClient, account: KinAccount, params: Whitelist): Promise<string> {
	return await whitelistService(client, account, params);
}
