import express from 'express';
import swaggerUi from 'swagger-ui-express';
import healthController from './controllers/HealthController';
import swaggerSpec from './lib/swagger';
import { bulkUploadRouter, jobListingRouter, userRouter } from './module';
import { ErrorHandlerMiddlerware } from './lib/middlewares';

const router: express.Router = express.Router();

// health check
router.get('/health', healthController.check);

// Swagger documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use('/users', userRouter);
router.use('/jobs', jobListingRouter);
router.use('/bulk-upload', bulkUploadRouter);

// Handles '404 not found'
router.use(ErrorHandlerMiddlerware.notFound);

export default router;
