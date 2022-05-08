import type { NFT, SetMetaData, Transaction, BlockEvent } from './types';

import * as fcl from '@onflow/fcl';
import * as types from '@onflow/types';

import { nftScript, setMetaDataScript } from './scripts';

import config from './config.json';

fcl.config.put('accessNode.api', 'https://access-mainnet-beta.onflow.org');

async function main(): Promise<void> {
	const latestBlock = await getLatestBlock();
	const sales = await getUFCSales(latestBlock - 249, latestBlock);

	const listingEvent = `A.${config.store_front.contract}.${config.store_front.name}.${config.store_front.events.listingCompleted}`;
	const withdrawEvent = `A.${config.ufc_nft.contract}.${config.ufc_nft.name}.${config.ufc_nft.events.withdraw}`;
	const depositEvent = `A.${config.ufc_nft.contract}.${config.ufc_nft.name}.${config.ufc_nft.events.deposit}`;
	const priceEvent = `A.${config.dapper_coin.contract}.${config.dapper_coin.name}.${config.dapper_coin.events.tokensWithdrawn}`;

	const events = [listingEvent, withdrawEvent, depositEvent, priceEvent];

	for (const sale of sales) {
		const transaction: Transaction = await fcl.send([fcl.getTransactionStatus(sale.transactionId)]).then(fcl.decode);
		const [listing, seller, buyer, price] = await Promise.all(events.map((event) => transaction.events.find((tx) => tx.type === event)));
		if (!listing || !seller || !buyer || !price) continue;

		try {
			const metadata: NFT = await fcl
				.send([fcl.script(nftScript), fcl.args([fcl.arg(buyer.data.to, types.Address), fcl.arg(listing.data.nftID, types.UInt64)])])
				.then(fcl.decode);
			const setData: SetMetaData = await fcl
				.send([fcl.script(setMetaDataScript), fcl.args([fcl.arg(metadata.setId, types.UInt32)])])
				.then(fcl.decode);

			console.log(`${setData.name} Edition ${metadata.editionNum} $${parseFloat(price.data.amount).toFixed(2)}`);
		} catch (err: any) {
			console.error(err);
		}
	}
}

async function getUFCSales(fromBlock: number, toBlock: number): Promise<BlockEvent[]> {
	const eventName = `A.${config.store_front.contract}.${config.store_front.name}.${config.store_front.events.listingCompleted}`;
	const typeName = `A.${config.ufc_nft.contract}.${config.ufc_nft.name}.${config.ufc_nft.type}`;

	const sales: BlockEvent[] = await fcl.send([fcl.getEventsAtBlockHeightRange(eventName, fromBlock, toBlock)]).then(fcl.decode);
	return sales.filter((sale) => sale.data.nftType === typeName && sale.data.purchased === true);
}

async function getLatestBlock(sealed: boolean = true): Promise<number> {
	return (await fcl.send([fcl.getBlock(sealed)]).then(fcl.decode)).height;
}

main();
