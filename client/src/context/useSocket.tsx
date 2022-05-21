import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000/');
const SocketContext = createContext(socket);

export const SocketProvider = SocketContext.Provider;
export const SocketConsumer = SocketContext.Consumer;

export default SocketContext;
