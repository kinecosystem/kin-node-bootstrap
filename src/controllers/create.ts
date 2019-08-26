import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {CreateRes, createAccountService} from "../services/create";

export declare type Create = Request & {
	destination: string,
	starting_balance: number,
	fee: 100,
	memo?: string
};

/**
 * Create an account with a public keypair
 * @returns {CreateRes}
 */
export async function create(client: KinClient, account: KinAccount, params: Create): Promise<CreateRes> {
	return await createAccountService(client, account, params);
}
