import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { SaleScheduler } from './lib/job';

const HTTP_PORT = parseInt(process.env.HTTP_PORT || '3000');

async function main(): Promise<void> {
	const app = express();
	const server = http.createServer(app);

	const io = new Server(server);

	io.on('connection', () => {
		console.log('Client connected');
	});

	new SaleScheduler(io);

	server.listen(HTTP_PORT, () => {
		console.log(`Server listening on port ${HTTP_PORT}`);
	});
}

main();
