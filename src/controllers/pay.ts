import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {payService} from "../services/pay";

export type PayRes = {
	tx_id: string
}

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
	const transactionId = await payService(client, account, params);
	return { tx_id: transactionId};
}
