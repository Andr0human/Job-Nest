import express from 'express';

import HomePageController from '../controllers/HomePageController';
import AsyncOperationController from '../controllers/AsyncOperationController';
import ValidationController from '../controllers/ValidationController';
import { ErrorHandlerMiddlerware } from '../lib/middlewares/Assignment-3';

const router: express.Router = express.Router();

// Home Page
router.get('/', HomePageController.assignment5);

// Task-5
router.get('/async-route', AsyncOperationController.doAsyncOperation);

// Task-6
router.post('/param-validation', ValidationController.paramValidation);

// Error catching middleware
router.use(ErrorHandlerMiddlerware.handle);

export default router;
