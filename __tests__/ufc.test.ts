import { getLatestBlock } from '../src/lib/block';
import { getSaleEvents } from '../src/lib/events';

describe('ufc functions', () => {
	it('should return the latest block as number', async () => {
		const block = await getLatestBlock();
		expect(block).toEqual(expect.any(Number));
	});

	it('should return array of sales', async () => {
		const sales = await getSaleEvents(29630650, 29630660);
		expect(sales).toEqual(expect.any(Array));
	});
});
