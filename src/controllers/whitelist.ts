import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {WhitelistRes, whitelistService} from "../services/whitelist";

export type Whitelist= Request &  {
		envelope: string,
		network_id: string
	};

/**
 * Sign a transaction with a whitelisted account
 * @returns {WhitelistRes}
 */
export async function whitelist(client: KinClient, account: KinAccount, params: Whitelist): Promise<WhitelistRes> {
	return await whitelistService(account, params);
}
