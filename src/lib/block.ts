import fcl from './fcl';

export async function getLatestBlock(sealed: boolean = true): Promise<number> {
	return (await fcl.send([fcl.getBlock(sealed)]).then(fcl.decode)).height;
}
