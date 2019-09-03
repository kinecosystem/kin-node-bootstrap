import {Environment} from "@kinecosystem/kin-sdk-node";

require('dotenv').config();

const pjson = require('pjson');
export const VERSION: any = pjson.version;
export const MEMO_CAP: number = 21;
export const ANON_APP_ID: string = "anon";
export const MEMO_TEMPLATE = `1-${ANON_APP_ID}-`;

export const INTEGRATION_ENVIRONMENT = integEnv();

function integEnv(): Environment {
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
