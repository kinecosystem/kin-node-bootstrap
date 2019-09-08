import {createApp} from "../../src/app";
import {Environment, KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {getKinAccount} from "../../src/init";
import {ANON_APP_ID, INTEGRATION_ENVIRONMENT} from "../environment";
import {ConfigParams} from "../../src/config/environment";

const request = require('supertest');
export const config: ConfigParams = {
	SEED: 'SDH76EUIJRM4LARRAOWPBGEAWJMRXFUDCFNBEBMMIO74AWB3MZJYGJ4J',
	HORIZON_ENDPOINT: Environment.Testnet.url,
	NETWORK_PASSPHRASE: Environment.Testnet.passphrase,
	NETWORK_NAME: 'Kin Bootstrap',
	APP_ID: ANON_APP_ID,
	CHANNEL_COUNT: 2,
	CHANNEL_SALT: 'bootstrap',
	CHANNEL_STARTING_BALANCE: 1000,
	PORT: 3000,
	CONSOLE_LOGGER: 'SILLY'
};
describe('Test routes', () => {
	let app: any;
	let account: KinAccount;

	const client = new KinClient(INTEGRATION_ENVIRONMENT);

	beforeEach(async () => {
		app = await createApp(config);
		account = await getKinAccount(client, config);
	}, 120000);

	test('Post Whitelist - successful', async () => {
		const envelope = `AAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAZAAfJbkAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAA
			AAAAAAAQAAAAAAAAABAAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAAAAAAAAABhqAAAAAAAAAAAIkSdAIAAAAQDlwLj
			Xrjpa/FmtpxrnrRrYbRBtVkpqgaHgy9R0gG/PpLtcuces9LLB3B8WmhqS47AlFMPg80WSD2Rv+QbJNHwi23RThAAAAQICXI9dNj/rnP1JVjD
			YMSopUaxM/nUIYx36BmaeYuNIhTEfol6dF5G7ufWRE1OX3mWbcAt/cxCoUz6vBUCbl9QA=`;
		const response = await request(app).post('/whitelist').send({
			envelope: envelope,
			network_id: INTEGRATION_ENVIRONMENT.passphrase
		});
		const data = JSON.parse(response.text);
		expect(data.tx_envelope).toEqual('AAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAZAAfJbkAAAABAAAAAQAAAAAAAA' +
			'AAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAAAAAAAAABhqAAAAAAAAAA' +
			'AMkSdAIAAAAQDlwLjXrjpa/FmtpxrnrRrYbRBtVkpqgaHgy9R0gG/PpLtcuces9LLB3B8WmhqS47AlFMPg80WSD2Rv+QbJNHwi23RThAAAA' +
			'QICXI9dNj/rnP1JVjDYMSopUaxM/nUIYx36BmaeYuNIhTEfol6dF5G7ufWRE1OX3mWbcAt/cxCoUz6vBUCbl9QD6hE9FAAAAQElek5+mPpU' +
			'ZWb4OPG/Hn00eOiRxEHjGY9N8hJvGnpsnOkHUt1a2As64E2ORnqgFtwTzz7aRii6NTxI1FFG1HAw=');
	}, 120000);

	test('Post Whitelist - envelope is not valid', async () => {
		const envelope = `BAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAZAAfJbkAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAA
			AAAAAAAQAAAAAAAAABAAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAAAAAAAAABhqAAAAAAAAAAAIkSdAIAAAAQDlwLj
			Xrjpa/FmtpxrnrRrYbRBtVkpqgaHgy9R0gG/PpLtcuces9LLB3B8WmhqS47AlFMPg80WSD2Rv+QbJNHwi23RThAAAAQICXI9dNj/rnP1JVjD
			YMSopUaxM/nUIYx36BmaeYuNIhTEfol6dF5G7ufWRE1OX3mWbcAt/cxCoUz6vBUCbl9QA=`;
		const response = await request(app).post('/whitelist').send({
			envelope: envelope,
			network_id: INTEGRATION_ENVIRONMENT.passphrase
		});
		const data = JSON.parse(response.text);
		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4004);
		expect(data.title).toEqual('Bad Request');
		expect(data.status).toEqual(400);
		expect(data.message).toEqual('The service was unable to decode the received transaction envelope. ERROR: XDR Read Error: Unknown PublicKeyType member for value 67108864');
	}, 120000);

	test('Post Whitelist - network_id does not exist', async () => {
		const envelope = `BAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAZAAfJbkAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAA
			AAAAAAAQAAAAAAAAABAAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAAAAAAAAABhqAAAAAAAAAAAIkSdAIAAAAQDlwLj
			Xrjpa/FmtpxrnrRrYbRBtVkpqgaHgy9R0gG/PpLtcuces9LLB3B8WmhqS47AlFMPg80WSD2Rv+QbJNHwi23RThAAAAQICXI9dNj/rnP1JVjD
			YMSopUaxM/nUIYx36BmaeYuNIhTEfol6dF5G7ufWRE1OX3mWbcAt/cxCoUz6vBUCbl9QA=`;
		const response = await request(app).post('/whitelist').send({
			envelope: envelope
		});
		const data = JSON.parse(response.text);
		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4006);
		expect(data.title).toEqual('Bad Request');
		expect(data.status).toEqual(400);
		expect(data.message).toEqual('The parameter \'network_id\' was missing from the requests body');
	}, 120000);
});
