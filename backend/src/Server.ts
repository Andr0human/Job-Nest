import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { IServerConfig } from './config';
import Database from './lib/database';
import router from './routes';
import logger from './lib/logger';
import CountryService from './module/country/Service';

class Server {
    // eslint-disable-next-line no-use-before-define
    private static instance: Server;

    private readonly app: express.Application;

    private readonly config: IServerConfig;

    private readonly database: Database;

    private constructor(config: IServerConfig) {
        this.app = express();
        this.config = config;
        this.database = Database.getInstance(this.config.mongoUrl);
    }

    public static getInstance(config: IServerConfig): Server {
        if (!Server.instance) {
            Server.instance = new Server(config);
            Server.instance.bootStrap();
        }
        return Server.instance;
    }

    getApp(): express.Application {
        return this.app;
    }

    private bootStrap(): void {
        this.configureMiddlewares();
        this.configureRoutes();
    }

    private configureMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(morgan('dev'));
    }

    private configureRoutes(): void {
        this.app.use(router);
    }

    connectDB = async (): Promise<void> => {
        await this.database.connect();
    };

    disconnectDB = async (): Promise<void> => {
        await this.database.disconnect();
    };

    run = async (): Promise<void> => {
        // connect to DB
        await this.connectDB();

        // seed the country database
        const countryService: CountryService = new CountryService();
        await countryService.initialSeed();

        this.app.listen(this.config.port, () => {
            logger.info(`Node Server Running In ${this.config.devMode} On Port http://localhost:${this.config.port}`);
        });
    };
}

export default Server;
