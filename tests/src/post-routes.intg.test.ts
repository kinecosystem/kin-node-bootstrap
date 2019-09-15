import {createApp} from "../../src/app";
import {Channels, KeyPair, KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {getKinAccount} from "../../src/init";
import {LowBalanceError} from "../../src/errors";
import {ANON_APP_ID, INTEGRATION_ENVIRONMENT, MEMO_TEMPLATE, sleepOnce} from "../environment";
import {ConfigParams} from "../../src/config/environment";

const request = require('supertest');

let app: any;
let account: KinAccount;
let channelsKeyPair: KeyPair[];
let client: KinClient = new KinClient(INTEGRATION_ENVIRONMENT);
let destination: string;
let source: KeyPair;

describe('Test route pay', () => {
	beforeEach(async () => {
		destination = KeyPair.generate().publicAddress;
		source = KeyPair.generate();
		const config: ConfigParams = {
			SEED: source.seed,
			HORIZON_ENDPOINT: INTEGRATION_ENVIRONMENT.url,
			NETWORK_PASSPHRASE: INTEGRATION_ENVIRONMENT.passphrase,
			NETWORK_NAME: INTEGRATION_ENVIRONMENT.name,
			APP_ID: ANON_APP_ID,
			CHANNEL_COUNT: 2,
			CHANNEL_SALT: 'bootstrap',
			CHANNEL_STARTING_BALANCE: 1,
			PORT: 3000,
			CONSOLE_LOGGER: 'SILLY'
		};
		await client.friendbot({
			address: source.publicAddress,
			amount: config.CHANNEL_STARTING_BALANCE * config.CHANNEL_COUNT + 1000
		});

		await client.friendbot({
			address: destination,
			amount: 10000
		});

		channelsKeyPair = await Channels.createChannels({
			environment: INTEGRATION_ENVIRONMENT,
			baseSeed: config.SEED,
			salt: config.CHANNEL_SALT,
			channelsCount: config.CHANNEL_COUNT,
			startingBalance: config.CHANNEL_STARTING_BALANCE
		});

		app = await createApp(config);
		account = await getKinAccount(client, config);
	}, 120000);

	test('Post Pay - successful', async () => {
		const amount = 150;
		const memo = 'pay-successful';
		const payResponse = await request(app).post('/pay').send({
			destination: destination,
			amount: amount,
			memo: memo
		});
		const payData = JSON.parse(payResponse.text);
		const paymentRequest = await sleepOnce(request(app).get, `/payment/${payData.tx_id}`);
		const paymentData = JSON.parse(paymentRequest.text);

		expect(paymentData.source).toEqual(source.publicAddress);
		expect(paymentData.destination).toEqual(destination);
		expect(paymentData.amount).toEqual(amount);
		expect(paymentData.memo).toEqual(MEMO_TEMPLATE + memo);
	}, 120000);

	test('Post Pay - successful with channels', async () => {
		const amount = 150;
		const memo = 'pay-successful';
		const payResponse = await request(app).post('/pay').send({
			destination: destination,
			amount: amount,
			memo: memo
		});
		const payData = JSON.parse(payResponse.text);
		const history = await sleepOnce(request(app).get, `/payment/${payData.tx_id}`);
		if (history && history.text === false)
			expect(history.source === channelsKeyPair[0].publicAddress.toString() || history.source === channelsKeyPair[1].publicAddress.toString()).toBeTruthy();
	}, 120000);

	test('Post Pay - balance too low', async () => {
		const balance = await account.getBalance();

		const response = await request(app).post('/pay').send({
			destination: destination,
			amount: balance * 2,
			memo: 'pay-successful'
		});
		expect(response.text).toEqual(LowBalanceError().toString());
	}, 120000);
});

describe('Test route create', () => {
	beforeEach(async () => {
		destination = KeyPair.generate().publicAddress;
		const keyPair = KeyPair.generate();
		const config: ConfigParams = {
			SEED: keyPair.seed,
			HORIZON_ENDPOINT: INTEGRATION_ENVIRONMENT.url,
			NETWORK_PASSPHRASE: INTEGRATION_ENVIRONMENT.passphrase,
			NETWORK_NAME: INTEGRATION_ENVIRONMENT.name,
			APP_ID: ANON_APP_ID,
			CHANNEL_COUNT: 2,
			CHANNEL_SALT: 'bootstrap',
			CHANNEL_STARTING_BALANCE: 1,
			PORT: 3000,
			CONSOLE_LOGGER: 'SILLY'
		};
		await client.friendbot({
			address: keyPair.publicAddress,
			amount: config.CHANNEL_STARTING_BALANCE * config.CHANNEL_COUNT + 1000
		});

		await client.friendbot({
			address: destination,
			amount: 10000
		});

		channelsKeyPair = await Channels.createChannels({
			environment: INTEGRATION_ENVIRONMENT,
			baseSeed: config.SEED,
			salt: config.CHANNEL_SALT,
			channelsCount: config.CHANNEL_COUNT,
			startingBalance: config.CHANNEL_STARTING_BALANCE
		});

		app = await createApp(config);
		account = await getKinAccount(client, config);
	}, 120000);

	test('Post Create - successful', async () => {
		const startingBalance = 200;
		const keyPair = KeyPair.generate();
		await request(app).post('/create').send({
			destination: keyPair.publicAddress,
			starting_balance: startingBalance,
			memo: 'create-successful'
		});
		const responseBalance = await sleepOnce(request(app).get, `/balance/${keyPair.publicAddress}`);
		const data = JSON.parse(responseBalance.text);
		expect(data.balance).toEqual(startingBalance);
	}, 120000);

	test('Post Create - successful with channels', async () => {
		const balance = 201;
		const memo = 'create-successful';
		const keyPair = KeyPair.generate();
		await request(app).post('/create').send({
			destination: keyPair.publicAddress,
			starting_balance: balance,
			memo: memo
		});
		const responseBalance = await sleepOnce(request(app).get, `/balance/${keyPair.publicAddress}`);
		const data = JSON.parse(responseBalance.text);
		expect(data.balance).toEqual(balance);
	}, 120000);
});
