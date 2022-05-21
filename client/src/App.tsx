import { useContext, useEffect } from 'react';

import SocketContext from './context/useSocket';
import SaleContext from './context/useSale';

import dayjs from './lib/dayjs';

function App() {
	const socket = useContext(SocketContext);
	const { sales, addSales } = useContext(SaleContext);

	useEffect(() => {
		socket.on('sales', (data) => {
			addSales(data.sales);
		});

		return () => {
			socket.off('sales');
		};
	}, [socket, addSales]);

	return (
		<div className="max-w-screen-2xl mx-auto py-8 space-y-8">
			<div className="text-center">
				<div className="font-bold text-2xl">Latest UFC Strike Sales</div>
			</div>

			<div className="flex flex-col">
				<div className="-my-2">
					<div className="py-2 min-w-full">
						<div className="shadow rounded over">
							<table className="min-w-full divide-y divide-gray-700 border border-gray-700 rounded-sm">
								<thead className="bg-dark-800 bg-gray-800 rounded-sm">
									<tr>
										<th scope="col" className="px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Moment
										</th>
										<th scope="col" className="px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Price
										</th>
										<th scope="col" className="px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Seller
										</th>
										<th scope="col" className="px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Buyer
										</th>
										<th scope="col" className="px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Date
										</th>
									</tr>
								</thead>
								<tbody className="bg-dark-800 divide-y divide-gray-700">
									{sales.map((sale, idx) => (
										<tr key={idx}>
											<td className="px-6 py-2 whitespace-nowrap">
												<div className="flex items-center space-x-4">
													<div>
														<img className="h-20 w-20" src={sale.image} alt={sale.image} />
													</div>
													<div className="font-bold">{sale.name}</div>
												</div>
											</td>

											<td className="px-6 py-2 whitespace-nowrap">
												<div className="font-bold">${parseFloat(sale.price).toFixed(2)}</div>
											</td>

											<td className="px-6 py-2 whitespace-nowrap">
												<div className="font-bold">{sale.seller}</div>
											</td>

											<td className="px-6 py-2 whitespace-nowrap">
												<div className="font-bold">{sale.buyer}</div>
											</td>

											<td className="px-6 py-2 whitespace-nowrap">
												<div className="font-bold">{dayjs(sale.timestamp).format('lll')}</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
