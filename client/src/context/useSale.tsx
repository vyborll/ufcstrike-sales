import React, { createContext, useState } from 'react';

import dayjs from '../lib/dayjs';

type Sale = {
	image: string;
	seller: string;
	buyer: string;
	editionNum: number;
	name: string;
	price: string;
	timestamp: string;
};

interface SaleDefaultContext {
	sales: Sale[];
	addSales: (sales: Sale[]) => void;
}

const SaleContext = createContext<SaleDefaultContext>({ sales: [], addSales: () => {} });

export const SaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [sales, setSales] = useState<Sale[]>([]);

	const addSales = (newSales: Sale[]) => {
		const newArr = [...newSales, ...sales].sort((a, b) => (dayjs(b.timestamp).isAfter(dayjs(a.timestamp)) ? 1 : -1));
		setSales(newArr.filter((_, idx) => idx + 1 <= 20));
	};

	return <SaleContext.Provider value={{ sales, addSales }}>{children}</SaleContext.Provider>;
};

export default SaleContext;
