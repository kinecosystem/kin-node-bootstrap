import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {createAccountService} from "../services/create";

export type CreateRes = {
	tx_id: string
}

export declare type Create = Request & {
	destination: string,
	starting_balance: number,
	memo?: string
};

/**
 * Create an account with a public keypair
 * @returns {CreateRes}
 */
export async function create(client: KinClient, account: KinAccount, params: Create): Promise<CreateRes> {
	const transactionId = await createAccountService(client, account, params);
	return { tx_id: transactionId};
}
