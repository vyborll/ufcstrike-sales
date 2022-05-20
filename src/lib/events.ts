import config from '../config.json';

export const LISTING_EVENT = `A.${config.store_front.contract}.${config.store_front.name}.${config.store_front.events.listingCompleted}`;
export const WITHDRAW_EVENT = `A.${config.ufc_nft.contract}.${config.ufc_nft.name}.${config.ufc_nft.events.withdraw}`;
export const DEPOSIT_EVENT = `A.${config.ufc_nft.contract}.${config.ufc_nft.name}.${config.ufc_nft.events.deposit}`;
export const TOKENS_WITHDRAWN = `A.${config.dapper_coin.contract}.${config.dapper_coin.name}.${config.dapper_coin.events.tokensWithdrawn}`;
