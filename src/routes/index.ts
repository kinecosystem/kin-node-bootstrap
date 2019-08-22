import {getStatus} from "../controllers/status";
import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import * as core from "express-serve-static-core";
import {GetBalance, getBalance} from "../controllers/balance";
import {GetPayment, getPayment} from "../controllers/payment";
import {Pay, pay} from "../controllers/pay";
import {Create, create} from "../controllers/create";
import {whitelist} from "../controllers/whitelist";
import {PaymentRequest, paymentValidator} from "../middlewares/payment";
import {balanceRequest, balanceValidator} from "../middlewares/balance";
import {createRequest, createValidator} from "../middlewares/create";
import {payRequest, payValidator} from "../middlewares/pay";

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
		const result = await promise(...boundParams);
		return res.json(result || { message: 'OK' });
	} catch (error) {
		return res.status(500).json(error);
	}
};

module.exports = function(client: KinClient, account: KinAccount): Promise<core.Router> {
	const router = express.Router();
	/* GET home page. */
	router.get('/', function (req: any, res: any, next: any) {
		res.render('index', {title: 'Express'});
	});

	router
		.get('/status', routerHandler(getStatus,(req: any, res: any, next: any) => [client, account]))
		.get('/payment/:hash', PaymentRequest, paymentValidator, routerHandler(getPayment, (req: GetPayment, res: any, next: any) => [client, req.params.hash]))
		.get('/balance/:address', balanceRequest, balanceValidator, routerHandler(getBalance, (req: GetBalance, res: any, next: any) => [client, req.params.address]))
		.post('/create', createRequest, createValidator, routerHandler(create, (req: Create, res: any, next: any) => [client, account, (req as any).body]))
		.post('/pay', payRequest, payValidator, routerHandler(pay, (req: Pay, res: any, next: any) => [client, account, (req as any).body]))
		.post('/whitelist', routerHandler(whitelist, (req: Pay, res: any, next: any) => [client, account, (req as any).body]));
	return router;
}
