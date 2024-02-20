import dotenv from 'dotenv';
import IServerConfig from './IConfig';

dotenv.config();

// Load configuration from .env file
const serverConfig: IServerConfig = Object.freeze({
    devMode: process.env.DEV_MODE ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    dummyToken: process.env.DUMMY_TOKEN ?? '',
    jwtSecret: process.env.JWT_SECRET ?? '',
    mongoUrl: process.env.MONGO_URL ?? '',
});

export default serverConfig;
