import {KinClient} from "@kinecosystem/kin-sdk-node";
import {PaymentRes, paymentService} from "../services/payment";

export type GetPayment = Request & {
	params: {
		hash: string;
	}
};

/**
 * Get a status of a payment by transaction's hash
 * @returns {PaymentRes}
 */
export async function getPayment(client: KinClient, hash: string): Promise<PaymentRes> {
	return await paymentService(client, hash);
}
