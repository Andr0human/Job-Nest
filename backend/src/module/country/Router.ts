import express from 'express';
import CountryController from './Controller';

class CountryRouter {
    // eslint-disable-next-line no-use-before-define
    private static instance: CountryRouter;

    public router: express.Router;

    private readonly countryController: CountryController;

    private constructor() {
        this.router = express.Router();
        this.countryController = new CountryController();
        this.setupRoutes();
    }

    static getInstance(): CountryRouter {
        if (!CountryRouter.instance) {
            CountryRouter.instance = new CountryRouter();
        }

        return CountryRouter.instance;
    }

    private setupRoutes(): void {
        this.router.get('/', CountryController.index);
        this.router.get('/get/:name', this.countryController.getByName);
        this.router.get('/getAll', this.countryController.getAll);
        this.router.post('/create', this.countryController.create);
    }
}

export default CountryRouter.getInstance().router;
