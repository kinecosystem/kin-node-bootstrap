import {getStatus} from "../controllers/status";
import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import * as core from "express-serve-static-core";
import {GetBalance, getBalance} from "../controllers/balance";
import {GetPayment, getPayment} from "../controllers/payment";
import {Pay, pay} from "../controllers/pay";
import {Create, create} from "../controllers/create";
import {Whitelist, whitelist} from "../controllers/whitelist";
import {PaymentRequest, paymentValidator} from "../middlewares/payment";
import {balanceRequest, balanceValidator} from "../middlewares/balance";
import {createRequest, createValidator} from "../middlewares/create";
import {payRequest, payValidator} from "../middlewares/pay";
import {WhitelistRequest, whitelistValidator} from "../middlewares/whitelist";
import {logger} from "../app";

const express = require('express');
/**
 * Handles controller execution and responds to user (API Express version).
 * @param promise Controller Promise.
 * @param params A function (req, res, next), all of which are optional
 * that maps our desired controller parameters. I.e. (req) => [req.params.username, ...].
 */
const routerHandler = (promise: any, params: any) => async (req: any, res: any, next: any) => {
	const boundParams = params ? params(req, res, next) : [];
	try {
		logger.info(`Got request ${req.method} ${req.path}, body: ${JSON.stringify(req.body)}`);
		const result = await promise(...boundParams);
		return res.json(result || { message: 'OK' });
	} catch (error) {
		next(error);
	}
};

export function indexRouter(client: KinClient, account: KinAccount): Promise<core.Router> {
	const router = express.Router();
	router
		.get('/status', routerHandler(getStatus,(req: any, res: any, next: any) => [client, account]))
		.get('/payment/:hash', PaymentRequest, paymentValidator, routerHandler(getPayment, (req: GetPayment, res: any, next: any) => [client, req.params.hash]))
		.get('/balance/:address', balanceRequest, balanceValidator, routerHandler(getBalance, (req: GetBalance, res: any, next: any) => [client, req.params.address]))
		.post('/create', createRequest, createValidator, routerHandler(create, (req: Create, res: any, next: any) => [client, account, (req as any).body]))
		.post('/pay', payRequest, payValidator, routerHandler(pay, (req: Pay, res: any, next: any) => [client, account, (req as any).body]))
		.post('/whitelist', WhitelistRequest, whitelistValidator, routerHandler(whitelist, (req: Whitelist, res: any, next: any) => [account, (req as any).body]));
	return router;
}
