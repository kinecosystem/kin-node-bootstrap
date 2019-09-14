import {Channels, Environment, KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {ConfigParams} from "./config/environment";

function getNetworkEnv(config: ConfigParams): Environment {
	return new Environment(
		{
			url: config.HORIZON_ENDPOINT,
			passphrase: config.NETWORK_PASSPHRASE,
			name: config.NETWORK_NAME
		});
}

export function getKinClient(config: ConfigParams): KinClient {
	return new KinClient(getNetworkEnv(config));
}

export async function getKinAccount(client: KinClient, config: ConfigParams): Promise<KinAccount> {
	const keyPairs = await Channels.createChannels({
		environment: getNetworkEnv(config),
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
