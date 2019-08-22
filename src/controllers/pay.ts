import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {payService} from "../services/pay";

export type Pay = Request &  {
		destination: string,
		amount: number,
		memo?: string
	};

/**
 * Get a status of the account
 * @returns {string}
 */
export async function pay(client: KinClient, account: KinAccount, params: Pay): Promise<string> {
	return await payService(client, account, params);
}
