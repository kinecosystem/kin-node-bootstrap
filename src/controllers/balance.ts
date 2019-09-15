import {getBalanceService} from '../services/balance';
import {KinClient} from "@kinecosystem/kin-sdk-node";

export type BalanceRes = {
	balance: number
}

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
	const balance = await getBalanceService(client, address);
	return { balance: balance };
}
