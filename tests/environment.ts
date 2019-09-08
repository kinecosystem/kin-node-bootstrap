import {Environment} from "@kinecosystem/kin-sdk-node";

require('dotenv').config();

const pjson = require('pjson');
export const VERSION: any = pjson.version;
export const MEMO_CAP: number = 21;
export const ANON_APP_ID: string = "anon";
export const MEMO_TEMPLATE = `1-${ANON_APP_ID}-`;

export const INTEGRATION_ENVIRONMENT = new Environment(
	{
		url: Environment.Testnet.url,
		passphrase: Environment.Testnet.passphrase,
		friendbotUrl: Environment.Testnet.friendbotUrl,
		name: 'Kin Bootstrap'
	});
