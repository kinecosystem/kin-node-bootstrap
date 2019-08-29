import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {whitelistService} from "../services/whitelist";

export type WhitelistRes = {
	tx_envelope: string
}

export type Whitelist= Request &  {
		envelope: string,
		network_id: string
	};

/**
 * Sign a transaction with a whitelisted account
 * @returns {WhitelistRes}
 */
export async function whitelist(client: KinClient, account: KinAccount, params: Whitelist): Promise<WhitelistRes> {
	const transacionId = await whitelistService(account, params);
	return { tx_envelope: transacionId};
}
