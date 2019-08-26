import {KinAccount, KinClient, NetworkError} from "@kinecosystem/kin-sdk-node";
import {Whitelist} from "../controllers/whitelist";
import {CantDecodeTransactionError, InvalidParamError} from "../errors";

export type WhitelistRes = {
	tx_envelope: string
}

export async function whitelistService(whitelistedAccount: KinAccount, params: Whitelist): Promise<WhitelistRes> {
	let whiteTransaction;
	try {
		whiteTransaction = await whitelistedAccount.whitelistTransaction({
			envelope: params.envelope,
			networkId: params.network_id
		});
	} catch (e) {
		if (e instanceof NetworkError) {
			throw InvalidParamError(`The network id sent in the request doesn't match the network the server is configured with`);
		} else throw CantDecodeTransactionError();
	}
	return { tx_envelope: whiteTransaction};
}
