import { type Request, type Response } from 'express';
import joi, { type ValidationResult, ObjectSchema } from 'joi';

import userData from '../lib/userData';
import IUser from '../module/user/entities/IUser';
import { SystemResponse } from '../lib/response-handler';

class UserController {
    static getData = (req: Request, res: Response): void => {
        new SystemResponse(res, 'user list found!', userData).ok();
    };

    static addUser = (req: Request, res: Response): void => {
        const newUser: IUser = req.body;
        userData.push(newUser);
        new SystemResponse(res, 'new user created!', newUser).created();
    };

    static addValidatedUser = (req: Request, res: Response): void => {
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

        const newUser: IUser = req.body;

        const validationResult: ValidationResult = userValidation.validate(
            newUser,
            {
                abortEarly: false,
            },
        );

        if (validationResult.error) {
            new SystemResponse(
                res,
                'new user validation failed!',
                validationResult.error,
            ).badRequest();
            return;
        }

        userData.push(newUser);
        new SystemResponse(res, 'new user created!', userData).created();
    };
}

export default UserController;
