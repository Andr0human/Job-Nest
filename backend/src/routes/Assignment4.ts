import express, { type Request, type Response } from 'express';

import UserController from '../controllers/UserController';
import HomePageController from '../controllers/HomePageController';
import {
    IpMiddleware,
    ValidationMiddleware,
} from '../lib/middlewares/Assignment-4';
import { SystemResponse } from '../lib/response-handler';

const router: express.Router = express.Router();

const ipMiddleware: IpMiddleware = new IpMiddleware();

// Home Page
router.get('/', HomePageController.assignment4);

// Task-2
router.post('/add-user', UserController.addValidatedUser);

// Task-4
// Register user [Req. fields - name, email, password]
router.post(
    '/register',
    ValidationMiddleware.inputValidation,
    (req: Request, res: Response) => {
        new SystemResponse(res, 'Registration successful!', req.body).created();
    },
);

// Task-5
// Add item to product-list [Req. fields - name, quantity, price]
// quantity and price must be numeric values
router.post(
    '/add-item',
    ValidationMiddleware.numericParamsValidation,
    (req: Request, res: Response) => {
        new SystemResponse(
            res,
            'Item successfully added to product list!',
            req.query,
        ).created();
    },
);

// Task-6
// Middleware to validate IP
router.get('/ip', ipMiddleware.check, (req: Request, res: Response) => {
    res.status(200).send({
        status: true,
        message: 'IP test completed!',
    });
});

// Task-7
// Middleware with dynamically fetch validation
// rules from a configuration file based on route.
router.get(
    '/registration',
    ValidationMiddleware.dynamicValidation,
    (req: Request, res: Response) => {
        res.json({
            status: true,
            message: 'User registered successfully!',
        });
    },
);

// Task-7
router.get(
    '/product',
    ValidationMiddleware.dynamicValidation,
    (req: Request, res: Response) => {
        res.json({
            status: true,
            message: 'Product added to list successfully!',
        });
    },
);

export default router;
