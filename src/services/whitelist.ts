import {KinAccount, NetworkError} from "@kinecosystem/kin-sdk-node";
import {Whitelist} from "../controllers/whitelist";
import {CantDecodeTransactionError, InvalidParamError} from "../errors";

export async function whitelistService(whitelistedAccount: KinAccount, params: Whitelist): Promise<string> {
	try {
		return await whitelistedAccount.whitelistTransaction({
			envelope: params.envelope,
			networkId: params.network_id
		});
	} catch (e) {
		if (e instanceof NetworkError) {
			throw InvalidParamError(`The network id sent in the request doesn't match the network the server is configured with`);
		} else throw CantDecodeTransactionError(e);
	}
}
