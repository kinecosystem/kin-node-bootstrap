import {createApp} from "../../src/app";
import {KeyPair, KinAccount} from "@kinecosystem/kin-sdk-node";
import {getKinAccount, getKinClient} from "../../src/init";
import {config, INTEGRATION_ENVIRONMENT, VERSION} from "../../src/config/config";

const request = require('supertest');

describe('Test routes', () => {
	let app: any;
	let account: KinAccount;
	let reciever: KinAccount;
	const keypair = KeyPair.generate();
	const client = getKinClient();
	const startingBalance: number = 100;

	beforeEach(async () => {
		app = await createApp();
		account = await getKinAccount(client);
		await client.friendbot({address: account.publicAddress, amount: startingBalance});
	}, 120000);

	test('Get status - successful', async () => {
		const publicAddress = KeyPair.addressFromSeed(config.SEED);
		const balance = await account.getBalance();

		const response = await request(app).get('/status');
		const text = JSON.parse(response.text);
		const data = text;

		expect(data.service_version).toBe(VERSION);
		expect(data.horizon).toBe(INTEGRATION_ENVIRONMENT.url);
		expect(data.public_address).toBe(publicAddress);
		expect(data.balance).toBe(balance);
		expect(data.channels.total_channels).toBe(config.CHANNEL_COUNT);
		expect(response.statusCode).toBe(200);
	});

	test('Get Balance - successful', async () => {
		const balance = await account.getBalance();
		const response = await request(app).get(`/balance/${account.publicAddress}`);
		expect(response.body.balance).toBe(balance);
	}, 12000);

	// test('Get Balance - account not found', async () => {
	// 	const response = await request(app).get(`/balance/${keypair.publicAddress}`);
	// 	console.log('response', typeof response);
	// 	expect(JSON.parse(response).text).rejects.toEqual(AccountNotFoundError(keypair.publicAddress));
	// }, 12000);
});
