import {Environment} from "@kinecosystem/kin-sdk-node";

require('dotenv').config();
const kin = require('@kinecosystem/kin-sdk-node');

export const DEVELOPMENT: string = 'DEVELOPMENT';
export const VERSION: string = '1.0.0';
export const MEMO_CAP: number = 28;
export const MEMO_TEMPLATE:string = '1-{}-';

// To override the configurations, use the '.env' file in the root directory.
export const config: ConfigParams = {
	// SEED: process.env.SEED || 'SCOMIY6IHXNIL6ZFTBBYDLU65VONYWI3Y6EN4IDWDP2IIYTCYZBCCE6C',
	// whitelisted account =>
	SEED: process.env.SEED || 'SDH76EUIJRM4LARRAOWPBGEAWJMRXFUDCFNBEBMMIO74AWB3MZJYGJ4J',
	APP_ID: process.env.APP_ID || kin.Environment.ANON_APP_ID,
	CHANNEL_COUNT: parseInt(process.env.CHANNEL_COUNT? process.env.CHANNEL_COUNT : '100'),
	CHANNEL_SALT: process.env.CHANNEL_SALT || 'bootstrap',
	CHANNEL_STARTING_BALANCE: parseInt(process.env.CHANNEL_STARTING_BALANCE? process.env.CHANNEL_STARTING_BALANCE : '1'),
	PORT: parseInt(process.env.PORT ? process.env.PORT : '3000'),
	LOG_LEVEL: process.env.LOG_LEVEL || 'INFO',
	CONSOLE_LEVEL: process.env.CONSOLE_LEVEL || 'SILLY',
	NODE_ENV: process.env.NODE_ENV || DEVELOPMENT
};

export interface ConfigParams {
	/**
	 * Source account privte address to sign transactions.
	 */
	SEED: string;
	/**
	 * Application's ID.
	 */
	APP_ID: string;
	/**
	 * Channels number to allocate.
	 */
	CHANNEL_COUNT: number;
	/**
	 * Channels generator's passphrase .
	 */
	CHANNEL_SALT: string;
	/**
	 * Channels starting balance.
	 */
	CHANNEL_STARTING_BALANCE: number;
	/**
	 * Server's port.
	 */
	PORT: number;
	/**
	 * Default log level.
	 */
	LOG_LEVEL: string;
	/**
	 * Default console log level.
	 */
	CONSOLE_LEVEL: string;
	/**
	 * Node environment status.
	 */
	NODE_ENV: string;
}

export const INTEGRATION_ENVIRONMENT = getIntegEnv();

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
