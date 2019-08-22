import {KinClient} from "@kinecosystem/kin-sdk-node";
import {payService} from "../services/payment";

export type GetPayment = Request & {
	params: {
		hash: string;
	}
};

/**
 * Get a status of the account
 * @returns {string}
 */
export async function getPayment(client: KinClient, hash: string): Promise<string> {
	return await payService(client, hash);
}
