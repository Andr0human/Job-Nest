import joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import IJobListing from './entities/IJobListing';
import { BaseValidation } from '../../lib/base';

export const jobValidation: ObjectSchema<IJobListing> = joi.object({
    title: joi.string().required(),
    company: joi.string().required(),
    logo: joi.string(),
    address: joi.object(),
    jobType: joi.string().required(),
    industry: joi.string().required(),
    description: joi.string(),
    requirements: joi.array(),
    responsibilities: joi.array(),
    qualifications: joi.object(),
    salary: joi.number().integer(),
    applicationDeadline: joi.date().required(),
    isRemote: joi.boolean().required(),
    contactEmail: joi
        .string()
        .email({ tlds: { allow: false } })
        .trim()
        .required(),
    applicationLink: joi.string().required(),
    createdBy: joi.string().hex().length(24),
    updatedBy: joi.string().hex().length(24),
});

class JobListingValidation extends BaseValidation {
    static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        JobListingValidation.validate(res, next, jobValidation, req.body, 'new job listing validation failed!');
    };
}

export default JobListingValidation;
