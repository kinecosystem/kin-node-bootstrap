import { getStatusService as getStatusService } from '../services/status';
import {KinAccount, KinClient} from '@kinecosystem/kin-sdk-node';

/**
 * Get a status of the account
 * @returns {string}
 */
export async function getStatus(client: KinClient, account: KinAccount): Promise<string> {
	return await getStatusService(client, account);
}
