import {Channels, Environment, KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {config, INTEGRATION_ENVIRONMENT} from "./config/config";

export function getKinClient(): KinClient {
	return new KinClient(INTEGRATION_ENVIRONMENT);
}

export async function getKinAccount(client: KinClient): Promise<KinAccount> {
	const keyPairs = await Channels.createChannels({
			environment: INTEGRATION_ENVIRONMENT,
			baseSeed: config.SEED,
			salt: config.CHANNEL_SALT,
			channelsCount: config.CHANNEL_COUNT,
			startingBalance: config.CHANNEL_STARTING_BALANCE
		});
	return client.createKinAccount({
		channelSecretKeys: keyPairs.map(keyPair => {
			return keyPair.seed;
		}),
		appId: config.APP_ID,
		seed: config.SEED
	});
}
