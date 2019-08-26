import {getStatusService as getStatusService, StatusRes} from '../services/status';
import {KinAccount, KinClient} from '@kinecosystem/kin-sdk-node';

/**
 * Get a status of the local account
 * @returns {StatusRes}
 */
export async function getStatus(client: KinClient, account: KinAccount): Promise<StatusRes> {
	return await getStatusService(client, account);
}
