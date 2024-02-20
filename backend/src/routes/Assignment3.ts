import express from 'express';

import HomePageController from '../controllers/HomePageController';
import UserController from '../controllers/UserController';

import {
    AuthMiddleware,
    ErrorHandlerMiddlerware,
    HeaderMiddleware,
    LogMiddleware,
    RateLimitMiddleware,
} from '../lib/middlewares/Assignment-3';

const router: express.Router = express.Router();

const authMiddleware: AuthMiddleware = new AuthMiddleware();
const headerMiddleware: HeaderMiddleware = new HeaderMiddleware(
    'Author',
    'Ayush Sinha',
);

const rateLimitMiddleware: RateLimitMiddleware = new RateLimitMiddleware(
    2,
    3000,
);

// Home Page
router.get('/', HomePageController.assignment3);

// Task-4,7
// Get data with authentication
router.get('/mock', authMiddleware.authenticate, UserController.getData);

// Task-5
// Add new user to data
router.post('/add-user', UserController.addUser);

// Task-9
// Log middleware
router.get('/mock-log', LogMiddleware.log, UserController.getData);

// Task-10
// Route handler with intentional error
router.get('/example', ErrorHandlerMiddlerware.example);

// Task-11
// Multiple chained middleware
router.use(
    '/mock-log-auth',
    LogMiddleware.log,
    authMiddleware.authenticate,
    UserController.getData,
);

// Task-12
// Header Middleware
router.use('/mock-header', headerMiddleware.setHeader, UserController.getData);

// Task-13
// Rate-Limited Middleware
router.use('/mock-rate', rateLimitMiddleware.fetch, UserController.getData);

// Error catching middleware
router.use(ErrorHandlerMiddlerware.handle);

export default router;
