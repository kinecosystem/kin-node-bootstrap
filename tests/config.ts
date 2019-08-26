import {Environment} from "@kinecosystem/kin-sdk-node";

function getIntegEnv(): Environment {
	const envUrl = process.env.INTEG_TESTS_NETWORK_URL;
	const envFriendbot = process.env.INTEG_TESTS_NETWORK_FRIENDBOT;
	const envPassphrase = process.env.INTEG_TESTS_NETWORK_PASSPHRASE;
	const name = process.env.INTEG_TESTS_NETWORK_NAME;

	if (!envUrl || !envFriendbot || !envPassphrase) {
		console.warn("Environment variables are not defined, using defaults.");
	}

	return new Environment(
		{
			url: envUrl ? envUrl : Environment.Testnet.url,
			passphrase: envPassphrase ? envPassphrase : Environment.Testnet.passphrase,
			friendbotUrl: envFriendbot ? envFriendbot : Environment.Testnet.friendbotUrl,
			name: name ? name : 'IntegEnv'
		});
}
