import {KinClient} from "@kinecosystem/kin-sdk-node";
import {AccountNotFoundError} from "../errors";

export type BalanceRes = {
	balance: number
}

export async function getBalanceService(client: KinClient, address: string): Promise<BalanceRes> {
	let balance = undefined;
	try {
		balance = await client.getAccountBalance(address);
	} catch (e) {
		if (e.type === 'ResourceNotFoundError')
		throw AccountNotFoundError(address);
		else {
			throw e;
		}
	}
	return { balance: balance };
}

