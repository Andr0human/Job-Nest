import { serverConfig } from './config';
import Server from './Server';

const server: Server = Server.getInstance(serverConfig);
server.run();
