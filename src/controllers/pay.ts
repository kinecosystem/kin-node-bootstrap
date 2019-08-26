import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {PayRes, payService} from "../services/pay";

export type Pay = Request &  {
		destination: string,
		amount: number,
		memo?: string
	};

/**
 * Transfer kins to another account
 * @returns {PayRes}
 */
export async function pay(client: KinClient, account: KinAccount, params: Pay): Promise<PayRes> {
	return await payService(client, account, params);
}
