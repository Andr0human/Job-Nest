import express from 'express';
import { AuthMiddleware } from '../../lib/middlewares';
import JobListingController from './Controller';
import upload from './helpers';
import JobListingValidation from './Validation';

class JobListingRouter {
    // eslint-disable-next-line no-use-before-define
    private static instance: JobListingRouter;

    public router: express.Router;

    private readonly jobListingController: JobListingController;

    private readonly authMiddleware: AuthMiddleware;

    private readonly jobListingValidation: JobListingValidation;

    private constructor() {
        this.router = express.Router();
        this.jobListingController = new JobListingController();
        this.authMiddleware = new AuthMiddleware();
        this.jobListingValidation = new JobListingValidation('jobId');
        this.setupRoutes();
    }

    static getInstance(): JobListingRouter {
        if (!JobListingRouter.instance) {
            JobListingRouter.instance = new JobListingRouter();
        }

        return JobListingRouter.instance;
    }

    private setupRoutes(): void {
        // Get all joblistings according to filters
        this.router.get('/', this.jobListingController.getAll);

        // Get a count of all joblistings
        this.router.get('/count', this.jobListingController.countAll);

        // Create job listing
        this.router.post(
            '/',
            JobListingValidation.create,
            this.jobListingController.create,
        );

        // Upload a job through csv
        this.router.post(
            '/upload',
            upload.single('file'),
            this.jobListingController.uploadByFile,
        );

        // Get job listing by id
        this.router.get(
            '/:jobId',
            this.jobListingValidation.id,
            this.jobListingController.getById,
        );

        // Update job listing by id
        this.router.put(
            '/:jobId',
            this.authMiddleware.authenticate,
            this.jobListingValidation.id,
            JobListingValidation.create,
            this.jobListingController.updateById,
        );

        // Delete job listing by id
        this.router.delete(
            '/:jobId',
            this.authMiddleware.authenticate,
            this.jobListingValidation.id,
            this.jobListingController.deleteById,
        );
    }
}

const routerInstance: express.Router = JobListingRouter.getInstance().router;
export default routerInstance;
