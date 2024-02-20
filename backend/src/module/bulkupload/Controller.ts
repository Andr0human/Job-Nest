import { Request, Response } from 'express';
import logger from '../../lib/logger';
import { SystemResponse } from '../../lib/response-handler';
import IBulkUpload from './entities/IBulkUpload';
import BulkUploadService from './Service';

class BulkUploadController {
    private readonly bulkUploadService: BulkUploadService;

    constructor() {
        this.bulkUploadService = new BulkUploadService();
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const total: number = await this.bulkUploadService.countDocuments();

            // PAGINATION
            const page: number = parseInt((req.query.page as string) ?? '1', 10);
            const limit: number = parseInt((req.query.limit as string) ?? '10', 10);
            const skip: number = (page - 1) * limit;

            if (skip >= total && total > 0) {
                logger.error('error in getAll API');
                new SystemResponse(res, 'This page doesn\'t exist!', {
                    total,
                    ...req.query,
                }).badRequest();
                return;
            }

            const result: IBulkUpload[] | null = await this.bulkUploadService.getAll(
                req.query,
                page,
                limit,
            );

            new SystemResponse(res, 'upload history found!', {
                total,
                data: result,
            }).ok();
        } catch (error: unknown) {
            logger.error('Error in getAll API', error);
            new SystemResponse(
                res,
                'error retrieving bulk upload history!',
                error,
            ).internalServerError();
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { uploadId } = req.params;

            const fields: string = '-__v';
            const uploadHistory: IBulkUpload | null = await this.bulkUploadService.getById(
                uploadId,
                fields,
            );

            if (!uploadHistory) {
                new SystemResponse(
                    res,
                    'No upload history found for the provided ID!',
                    { uploadId },
                ).notFound();
                return;
            }

            new SystemResponse(
                res,
                'upload history found successfully.',
                uploadHistory,
            ).ok();
        } catch (error: unknown) {
            logger.error('error in getById', error);

            new SystemResponse(
                res,
                'error retrieving upload history by uploadId!',
                error,
            ).internalServerError();
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const newUploadData: IBulkUpload = req.body;
            const result: IBulkUpload | null = await this.bulkUploadService.create(
                newUploadData,
            );
            new SystemResponse(res, 'new upload history added!', result).created();
        } catch (error: unknown) {
            new SystemResponse(
                res,
                'error creating new bulk upload history!',
                error,
            ).internalServerError();
        }
    };
}

export default BulkUploadController;
