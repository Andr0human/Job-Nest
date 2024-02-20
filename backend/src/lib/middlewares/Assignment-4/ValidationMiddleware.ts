import { type Request, type Response, type NextFunction } from 'express';
import { type ValidationResult } from 'joi';
import validationConfig from '../../utils/validationConfig';
import { SystemResponse } from '../../response-handler';
import logger from '../../logger';

interface IProductQueryParams {
  name?: string;
  quantity?: string;
  price?: string;
}

class ValidationMiddleware {
    private static isStrongPassword = (value: string): boolean => {
        const strongRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/;
        return strongRegex.test(value);
    };

    private static correctEmailFormat = (value: string): boolean => {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    private static isNumeric = (value: string | number): boolean => {
        if (typeof value === 'number') return true;

        if (typeof value === 'string') {
            const numericValue: number = parseFloat(value);
            return !Number.isNaN(numericValue);
        }
        return false;
    };

    static dynamicValidation = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const param: string = req.url.slice(1);
        const validationResult: ValidationResult = validationConfig[
            param
        ].validate(req.body, {
            abortEarly: false,
        });

        if (validationResult.error) {
            logger.error('dynamic validation error!', validationResult.error);

            new SystemResponse(
                res,
                `error occured in ${param} validation!`,
                validationResult.error,
            ).badRequest();
            return;
        }

        next();
    };

    static inputValidation = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            new SystemResponse(
                res,
                'Validation failed! All fields are required.',
                req.body,
            ).badRequest();
            return;
        }

        if (!ValidationMiddleware.isStrongPassword(password)) {
            new SystemResponse(
                res,
                'Weak password! It should have at least 8 characters, including uppercase, lowercase, and numbers',
                req.body,
            ).badRequest();
            return;
        }

        if (!ValidationMiddleware.correctEmailFormat(email)) {
            new SystemResponse(
                res,
                'Incorrect email format!',
                req.body,
            ).badRequest();
            return;
        }

        logger.info('input validation successful!');
        next();
    };

    static numericParamsValidation = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const { name, quantity, price }: IProductQueryParams = req.query;

        if (!name || !quantity || !price) {
            new SystemResponse(
                res,
                'Numeric validation failed! All fields are required.',
                req.query,
            ).badRequest();
            return;
        }

        if (!ValidationMiddleware.isNumeric(quantity)
             || !ValidationMiddleware.isNumeric(price)) {
            new SystemResponse(
                res,
                'Invalid input. Quantity and price must be numeric values.',
                req.query,
            ).badRequest();
            return;
        }

        logger.info('Numeric validation successful!');
        next();
    };
}

export default ValidationMiddleware;
