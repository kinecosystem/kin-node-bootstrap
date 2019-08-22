import {KinClient} from "@kinecosystem/kin-sdk-node";
import {AccountNotFoundError} from "../errors";

export async function getBalanceService(client: KinClient, address: string): Promise<string> {
	let balance = undefined;
	try {
		balance = await client.getAccountBalance(address);
	} catch (e) {
		throw AccountNotFoundError(address);
	}
	return JSON.stringify({ balance: balance });
}

