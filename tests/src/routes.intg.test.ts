import {createApp} from "../../src/app";
import {Channels, KeyPair, KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {getKinAccount} from "../../src/init";
import {AccountNotFoundError, InvalidParamError, MissingParamError, TransactionNotFoundError} from "../../src/errors";
import {ANON_APP_ID, INTEGRATION_ENVIRONMENT, MEMO_CAP, MEMO_TEMPLATE, sleepOnce, VERSION} from "../environment";
import {ConfigParams} from "../../src/config/environment";

const request = require('supertest');

let app: any;
let account: KinAccount;
let channelsKeyPair: KeyPair[];
let client: KinClient = new KinClient(INTEGRATION_ENVIRONMENT);
const destination = KeyPair.generate().publicAddress;
const keyPair: KeyPair = KeyPair.generate();
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

describe('Test Routes', () => {
	beforeAll(async () => {
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


	test('Get status - successful', async () => {
		const response = await request(app).get('/status');
		const data = JSON.parse(response.text);
		const balance = await account.getBalance();

		expect(data.service_version).toBe(VERSION);
		expect(data.horizon).toBe(INTEGRATION_ENVIRONMENT.url);
		expect(data.public_address).toBe(keyPair.publicAddress);
		expect(data.balance).toBe(balance);
		expect(data.channels.total_channels).toBe(config.CHANNEL_COUNT);
		expect(response.statusCode).toBe(200);
	}, 120000);

	test('Get Balance - successful', async () => {
		const balance = await account.getBalance();
		const response = await request(app).get(`/balance/${account.publicAddress}`);
		expect(response.body.balance).toBe(balance);
	}, 120000);

	test('Get Balance - account not found', async () => {
		const keyPair = KeyPair.generate();
		const response = await request(app).get(`/balance/${keyPair.publicAddress}`);
		expect(response.text).toEqual(AccountNotFoundError(keyPair.publicAddress).toString());
	}, 120000);

	test('Get Payment - successful', async () => {
		const amount = 150;
		const memo = 'pay-successful';
		const payResponse = await request(app).post('/pay').send({
			destination: destination,
			amount: amount,
			memo: memo
		});
		const payData = JSON.parse(payResponse.text);
		const response = await sleepOnce(request(app).get, `/payment/${payData.tx_id}`);
		const data = JSON.parse(response.text);
		expect(data.source).toEqual(keyPair.publicAddress);
		expect(data.destination).toEqual(destination);
		expect(data.amount).toEqual(amount);
		expect(data.memo).toEqual(`${MEMO_TEMPLATE}${memo}`);
		expect(data.timestamp).toBeDefined();
	}, 120000);

	test('Get Payment - wrong transaction', async () => {
		const response = await request(app).get('/payment/5d68a90441be50285d24fcfcea7a93bd6a2fee97d3cf7a9d46c62a7c2b1ad350');
		expect(response.text).toEqual(TransactionNotFoundError('5d68a90441be50285d24fcfcea7a93bd6a2fee97d3cf7a9d46c62a7c2b1ad350').toString());
	}, 120000);

	test('Post Pay - missing param', async () => {
		const response = await request(app).post('/pay').send({
			destination: destination,
			memo: 'pay-successful'
		});
		expect(response.text).toEqual(MissingParamError('The parameter \'amount\' was missing from the requests body').toString());
	}, 120000);

	test('Post Pay - negative minimum amount', async () => {
		const response = await request(app).post('/pay').send({
			destination: destination,
			amount: -150,
			memo: 'pay-failed'
		});
		expect(response.text).toEqual(InvalidParamError('Amount for payment must be bigger than 0').toString());
	}, 120000);

	test('Post Pay - wrong address', async () => {
		const response = await request(app).post('/pay').send({
			destination: destination + 'A',
			amount: 150,
			memo: 'pay-failed'
		});
		expect(response.text).toEqual(InvalidParamError(`Destination '${destination + 'A'}' is not a valid public address`).toString());
	}, 120000);

	test('Post Pay - too long memo', async () => {
		const memo = 'pay-failed-due-to-a-very-long-message';
		const response = await request(app).post('/pay').send({
			destination: destination,
			amount: 150,
			memo: memo
		});
		expect(response.text).toEqual(InvalidParamError(`Memo: '${memo}' is longer than ${MEMO_CAP}`).toString());
	}, 120000);

	test('Post Pay - missing param', async () => {
		const response = await request(app).post('/pay').send({
			destination: destination,
			memo: 'pay-successful'
		});
		expect(response.text).toEqual(MissingParamError('The parameter \'amount\' was missing from the requests body').toString());
	}, 120000);

	test('Post Create - wrong address', async () => {
		const keyPair = KeyPair.generate();
		const response = await request(app).post('/create').send({
			destination: keyPair.publicAddress + 'A',
			starting_balance: 300,
			memo: 'create-successful'
		});
		expect(response.text).toEqual(InvalidParamError(`Destination '${keyPair.publicAddress + 'A'}' is not a valid public address`).toString());
	}, 120000);

	test('Post Create - negative starting balance', async () => {
		const keyPair = KeyPair.generate();
		const response = await request(app).post('/create').send({
			destination: keyPair.publicAddress,
			starting_balance: -300,
			memo: 'create-successful'
		});
		expect(response.text).toEqual(InvalidParamError('Starting balance for account creation must not be negative').toString());
	}, 120000);

	test('Post Create - too long memo', async () => {
		const memo = 'create-failed-due-to-a-very-long-message';
		const keyPair = KeyPair.generate();
		const response = await request(app).post('/create').send({
			destination: keyPair.publicAddress,
			starting_balance: 300,
			memo: memo
		});
		expect(response.text).toEqual(InvalidParamError(`Memo: '${memo}' is longer than ${MEMO_CAP}`).toString());
	}, 120000);
});
