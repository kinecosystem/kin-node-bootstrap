import {KinClient} from "@kinecosystem/kin-sdk-node";
import {AccountNotFoundError} from "../errors";

export async function getBalanceService(client: KinClient, address: string): Promise<number> {
	try {
		return await client.getAccountBalance(address);
	} catch (e) {
		if (e.type === 'ResourceNotFoundError')
		throw AccountNotFoundError(address);
		else {
			throw e;
		}
	}
}

