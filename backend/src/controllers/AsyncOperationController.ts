import { type Request, type Response } from 'express';
import { SystemResponse } from '../lib/response-handler';
import logger from '../lib/logger';

class AsyncOperationController {
    static someAsyncOperation = async (): Promise<Error> => new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('An intentional error occured!'));
        }, 1000);
    });

    static doAsyncOperation = async (req: Request, res: Response): Promise<void> => {
        try {
            const result: Error = await AsyncOperationController.someAsyncOperation();

            new SystemResponse(res, 'Data fetched successfully!', result).ok();
        } catch (error: unknown) {
            logger.error('Error in async operation controller!', error);
            new SystemResponse(
                res,
                'Error fetching data!',
                error,
            ).internalServerError();
        }
    };
}

export default AsyncOperationController;
