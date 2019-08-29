import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";

export async function getStatusService(client: KinClient, account: KinAccount): Promise<number> {
	return await account.getBalance();

}
