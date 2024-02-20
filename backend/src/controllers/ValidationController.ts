import { type Request, type Response } from 'express';
import joi, { ObjectSchema, ValidationResult } from 'joi';
import logger from '../lib/logger';
import { SystemResponse } from '../lib/response-handler';

class ValidationController {
    static paramValidation = async (req: Request, res: Response): Promise<void> => {
        const userValidation: ObjectSchema<any> = joi.object({
            name: joi.string().min(3).trim().required(),
            email: joi.string().email().required(),
            password: joi.string().custom((value: string, helper: joi.CustomHelpers<any>) => {
                if (value.length < 8) {
                    return helper.message({
                        custom: 'Password must be at least 8 characters long',
                    });
                }
                return value;
            }).required(),
            phoneNumber: joi.string().allow(''),
        });

        const validationResult: ValidationResult = userValidation.validate(
            req.body,
            { abortEarly: false },
        );

        if (validationResult.error) {
            new SystemResponse(
                res,
                'Validation error!',
                validationResult.error,
            ).badRequest();
            return;
        }

        logger.info('Validation successful!');
        new SystemResponse(res, 'Validation successful!', req.body).ok();
    };
}

export default ValidationController;
