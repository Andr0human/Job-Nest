import { NextFunction, Request, Response } from 'express';
import Joi, { ObjectSchema, ValidationResult } from 'joi';
import logger from '../logger';
import { SystemResponse } from '../response-handler';

class BaseValidation {
    private readonly idType: string;

    constructor(idType: string) {
        this.idType = idType;
    }

    static validate = (
        res: Response,
        next: NextFunction,
        validator: ObjectSchema<any>,
        value: any,
        failedMsg: string,
    ): void => {
        const validationResult: ValidationResult<any> = validator.validate(
            value,
            { abortEarly: false },
        );
        if (validationResult.error) {
            logger.error(failedMsg, validationResult.error);
            new SystemResponse(res, failedMsg, validationResult.error).badRequest();
            return;
        }
        next();
    };

    id = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const idValidator: ObjectSchema<any> = Joi.object({
            [this.idType]: Joi.string().hex().length(24).required(),
        });

        BaseValidation.validate(res, next, idValidator, req.params, `${this.idType} validation failed!`);
    };
}

export default BaseValidation;
