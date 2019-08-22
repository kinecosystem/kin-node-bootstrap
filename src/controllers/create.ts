import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {createService} from "../services/create";

export declare type Create = Request & {
	destination: string,
	startingBalance: number,
	fee: 100,
	memo?: string
};

/**
 * Get a status of the account
 * @returns {string}
 */
export async function create(client: KinClient, account: KinAccount, params: Create): Promise<string> {
	return await createService(client, account, params);
}
