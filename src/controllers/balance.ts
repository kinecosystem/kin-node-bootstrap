import {getBalanceService} from '../services/balance';
import {KinClient} from "@kinecosystem/kin-sdk-node";

export type GetBalance = Request & {
	params: {
		address: string;
	}
};

/**
 * Get a status of the account
 * @returns {string}
 */
export async function getBalance(client: KinClient, address: string): Promise<string> {
	return await getBalanceService(client, address);
}
