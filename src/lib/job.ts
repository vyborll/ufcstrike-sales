import type { NFT, SetMetaData, BlockEvent, Transaction } from '../types';
import type { Server } from 'socket.io';
import { scheduleJob, Job } from 'node-schedule';
import * as types from '@onflow/types';

import config from '../config.json';
import { LISTING_EVENT, WITHDRAW_EVENT, DEPOSIT_EVENT, TOKENS_WITHDRAWN } from './events';
import { nftScript, setMetaDataScript } from '../scripts';

import { getLatestBlock } from './block';
import fcl from './fcl';

type Sale = {
	seller: string;
	buyer: string;
	name: string;
	editionNum: number;
	price: string;
};

export class SaleScheduler {
	private _job: Job;
	private _interval: string = '*/10 * * * * *';
	private io: Server;

	public isLoading: boolean = false;
	public lastBlock: number | null = null;
	public eventName: string = `A.${config.ufc_nft.contract}.${config.ufc_nft.name}.${config.ufc_nft.type}`;
	public events: string[] = [LISTING_EVENT, WITHDRAW_EVENT, DEPOSIT_EVENT, TOKENS_WITHDRAWN];

	constructor(io: Server) {
		this.io = io;
		this._job = scheduleJob(this._interval, this.run.bind(this));
	}

	stop() {
		this._job.cancel();
	}

	async run() {
		if (this.isLoading) return;
		this.isLoading = true;

		const sales = await this.getSales();

		const format = await Promise.all(
			sales.map(async (sale) => {
				const transaction: Transaction = await fcl.send([fcl.getTransactionStatus(sale.transactionId)]).then(fcl.decode);
				const [listing, seller, buyer, price] = await Promise.all(this.events.map((event) => transaction.events.find((tx) => tx.type === event)));
				if (!listing || !seller || !buyer || !price) return null;

				try {
					const metaData: NFT = await fcl
						.send([fcl.script(nftScript), fcl.args([fcl.arg(buyer.data.to, types.Address), fcl.arg(listing.data.nftID, types.UInt64)])])
						.then(fcl.decode);
					const setData: SetMetaData = await fcl
						.send([fcl.script(setMetaDataScript), fcl.args([fcl.arg(metaData.setId, types.UInt32)])])
						.then(fcl.decode);

					return {
						seller: seller.data.from,
						buyer: buyer.data.to,
						name: setData.name,
						editionNum: metaData.editionNum,
						price: price.data.amount,
					};
				} catch (err) {
					console.error(err);
					return null;
				}
			}),
		);

		const filter = format.filter((sale): sale is Sale => !!sale);

		this.io.emit('sales', { sales: filter });
		this.isLoading = false;
	}

	async getSales() {
		const latestBlock = await getLatestBlock();
		const startBlock = this.lastBlock ? this.lastBlock + 1 : await getLatestBlock();
		const endBlock = latestBlock - startBlock > 250 ? startBlock + 249 : latestBlock;

		this.lastBlock = endBlock;

		const events: BlockEvent[] = await fcl.send([fcl.getEventsAtBlockHeightRange(LISTING_EVENT, startBlock, endBlock)]).then(fcl.decode);
		return events.filter((event) => event.data.nftType === this.eventName && event.data.purchased === true);
	}
}
