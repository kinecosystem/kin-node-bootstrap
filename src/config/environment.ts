import {Environment} from "@kinecosystem/kin-sdk-node";

require('dotenv').config();

const pjson = require('pjson');
export const DEVELOPMENT: string = 'DEVELOPMENT';
export const VERSION: any = pjson.version;
export const MEMO_CAP: number = 21;
export const ANON_APP_ID: string = "anon";

// To override the configurations, use the '.env' file in the root directory.
export const config: ConfigParams = {
	// SEED: process.env.SEED || 'SCOMIY6IHXNIL6ZFTBBYDLU65VONYWI3Y6EN4IDWDP2IIYTCYZBCCE6C',
	// whitelisted account =>
	SEED: process.env.SEED || 'SDH76EUIJRM4LARRAOWPBGEAWJMRXFUDCFNBEBMMIO74AWB3MZJYGJ4J',
	HORIZON_ENDPOINT: process.env.HORIZON_ENDPOINT || Environment.Testnet.url,
	NETWORK_PASSPHRASE: process.env.NETWORK_PASSPHRASE || Environment.Testnet.passphrase,
	NETWORK_NAME: process.env.NETWORK_NAME || 'Kin Bootstrap',
	APP_ID: process.env.APP_ID || ANON_APP_ID,
	CHANNEL_COUNT: parseInt(process.env.CHANNEL_COUNT? process.env.CHANNEL_COUNT : '100'),
	CHANNEL_SALT: process.env.CHANNEL_SALT || 'bootstrap',
	CHANNEL_STARTING_BALANCE: parseInt(process.env.CHANNEL_STARTING_BALANCE? process.env.CHANNEL_STARTING_BALANCE : '1'),
	PORT: parseInt(process.env.PORT ? process.env.PORT : '3000'),
	LOG_LEVEL: process.env.LOG_LEVEL || 'INFO',
	CONSOLE_LEVEL: process.env.CONSOLE_LEVEL || 'SILLY',
	NODE_ENV: process.env.NODE_ENV || DEVELOPMENT
};

export interface ConfigParams {
	SEED: string;
	HORIZON_ENDPOINT: string;
	NETWORK_PASSPHRASE: string;
	NETWORK_NAME: string;
	APP_ID: string;
	CHANNEL_COUNT: number;
	CHANNEL_SALT: string;
	CHANNEL_STARTING_BALANCE: number;
	// Changing the port requires to modify the docker-compose.yml as well.
	PORT: number;
	LOG_LEVEL: string;
	CONSOLE_LEVEL: string;
	NODE_ENV: string;
}
