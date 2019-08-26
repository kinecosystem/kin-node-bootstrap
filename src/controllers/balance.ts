import {BalanceRes, getBalanceService} from '../services/balance';
import {KinClient} from "@kinecosystem/kin-sdk-node";

export type GetBalance = Request & {
	params: {
		address: string;
	}
};

/**
 * Get the balance of the requested account
 * @returns {BalanceRes}
 */
export async function getBalance(client: KinClient, address: string): Promise<BalanceRes> {
	return await getBalanceService(client, address);
}
