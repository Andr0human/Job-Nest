import { NextFunction, Request, Response } from 'express';
import joi, { ObjectSchema } from 'joi';
import { BaseValidation } from '../../lib/base';
import IBulkUpload from './entities/IBulkUpload';
import IErrorDetail from './entities/IErrorDetail';

class BulkUploadValidation extends BaseValidation {
    static create = (req: Request, res: Response, next: NextFunction): void => {
        const errorDetailSchema: ObjectSchema<IErrorDetail> = joi.object({
            message: joi.string().required(),
            rowNumber: joi.number().integer().required(),
        });

        const createValidator: ObjectSchema<IBulkUpload> = joi.object({
            status: joi.string().required(),
            endedAt: joi.date(),
            time: joi.number().integer().required(),
            filename: joi.string().required(),
            successfulEntries: joi.number().integer().required(),
            failedEntries: joi.number().integer().required(),
            entriesCompleted: joi.number().integer().required(),
            totalEntries: joi.number().integer().required(),
            createdBy: joi.string().hex().length(24),
            updatedBy: joi.string().hex().length(24),
            errorDetails: joi.array().items(errorDetailSchema),
        });

        BulkUploadValidation.validate(res, next, createValidator, req.body, 'bulk-record validation failed!');
    };
}

export default BulkUploadValidation;
