import { Request, Response } from 'express';
import logger from '../../lib/logger';
import { SystemResponse } from '../../lib/response-handler';
import JobService from './Services';
import IJobListing from './entities/IJobListing';

class JobListingController {
    private readonly jobListingService: JobService;

    constructor() {
        this.jobListingService = new JobService();
    }

    /**
   * @swagger
   * /jobs:
   *   get:
   *     tags:
   *       - Job Listings
   *     summary: Get all jobs
   *     description: Retrieve a list of jobs with pagination, sorting, and field selection.
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: The page number for pagination.
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: The number of items per page.
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         description: Sorting criteria.
   *       - in: query
   *         name: fields
   *         schema:
   *           type: string
   *         description: Fields to include or exclude in the response.
   *     responses:
   *       '200':
   *         description: A list of jobs
   *         content:
   *           application/json:
   *             example:
   *               success: true
   *               message: Jobs found successfully.
   *               data: []
   *       '500':
   *         description: Internal Server Error.
   *         content:
   *           application/json:
   *             example:
   *               success: false
   *               message: Error retrieving jobs.
   *               error: {}
   */
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const filters: any = await JobService.getFilters(req.query);
            const total: number = await this.jobListingService.countDocuments(
                filters,
            );

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

            const jobs: IJobListing[] = await this.jobListingService.getAll(
                req.query,
                filters,
                page,
                limit,
            );

            new SystemResponse(res, 'Job listing found!', {
                total,
                count: jobs.length,
                data: jobs,
            }).ok();
        } catch (error: unknown) {
            logger.error('error in getAll API', error);
            new SystemResponse(
                res,
                'Error retrieving job listings!',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /jobs/count:
     *   get:
     *     summary: Count All Job Listings
     *     description: Retrieve the total count of all job listings.
     *     tags:
     *       - Job Listings
     *     responses:
     *       '200':
     *         description: Job listing count retrieved successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: Job listing count!
     *               data:
     *                 count: 50
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Error retrieving job listings count!
     *               error: {}
     */
    countAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const total: number = await this.jobListingService.countDocuments({});
            new SystemResponse(res, 'Job listing count!', { count: total }).ok();
        } catch (error: unknown) {
            logger.error('error in countAll API', error);
            new SystemResponse(
                res,
                'Error retrieving job listings count!',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /jobs:
     *   post:
     *     summary: Create a New Job Listing
     *     description: Create a new job listing with the provided details.
     *     tags:
     *       - Job Listings
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/JobListing'
     *     responses:
     *       '201':
     *         description: Job listing created successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: Job listing created successfully.
     *               data:
     *                 jobListing:
     *                   $ref: '#/components/schemas/JobListing'
     *       '400':
     *         description: Bad Request. Invalid input or validation failed.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: New job listing validation failed.
     *               error: { validation error details }
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Error creating new job listing!
     *               error: {}
     */
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const newJobListing: IJobListing = req.body;
            const result: IJobListing = await this.jobListingService.create(
                newJobListing,
            );
            new SystemResponse(res, 'new job added!', result).created();
        } catch (error: any) {
            new SystemResponse(
                res,
                'error creating new job listing!',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /jobs/{jobId}:
     *   get:
     *     summary: Get Job Listing by ID
     *     description: Retrieve a job listing based on the provided job ID.
     *     tags:
     *       - Job Listings
     *     parameters:
     *       - in: path
     *         name: jobId
     *         schema:
     *           type: string
     *         required: true
     *         description: The unique identifier for the job listing.
     *     responses:
     *       '200':
     *         description: Job listing retrieved successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: Job found successfully.
     *               data:
     *                 job:
     *                   $ref: '#/components/schemas/JobListing'
     *       '404':
     *         description: Not Found. No job found for the provided ID.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: No job found for the provided ID!
     *               data:
     *                 jobId: 'jobId_value'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Error retrieving job listing by jobId.
     *               error: {}
     */
    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { jobId } = req.params;

            const fields: string = '-__v';
            const job: IJobListing | null = await this.jobListingService.getById(
                jobId,
                fields,
            );

            if (!job) {
                new SystemResponse(res, 'No job found for the provided ID!', {
                    jobId,
                }).notFound();
                return;
            }

            new SystemResponse(res, 'Job found successfully.', job).ok();
        } catch (error: unknown) {
            logger.error('error in getById', error);

            new SystemResponse(
                res,
                'Error retrieving job listing by jobId.',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /jobs/{jobId}:
     *   put:
     *     summary: Update Job Listing by ID
     *     description: Update a job listing based on the provided job ID with the given details.
     *     tags:
     *       - Job Listings
     *     parameters:
     *       - in: path
     *         name: jobId
     *         schema:
     *           type: string
     *         required: true
     *         description: The unique identifier for the job listing.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/JobListing'
     *     responses:
     *       '200':
     *         description: Job listing updated successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: Job with ID updated successfully.
     *               data:
     *                 job:
     *                   $ref: '#/components/schemas/JobListing'
     *       '400':
     *         description: Bad Request. Invalid input or validation failed.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Updated job listing validation failed.
     *               error: { validation error details }
     *       '401':
     *         description: Unauthorized. User authentication failed.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: User authentication failed!
     *               error:
     *                 name: JsonWebTokenError
     *                 message: jwt must be provided
     *       '404':
     *         description: Not Found. No job found for the provided ID.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: No job found for the provided ID!
     *               data:
     *                 jobId: 'jobId_value'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Error updating job listing.
     *               error: {}
     */
    updateById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { jobId } = req.params;
            const updatedJobListing: IJobListing = req.body;

            await this.jobListingService.updateById(jobId, updatedJobListing);
            new SystemResponse(
                res,
                `job with id:${jobId} updated!`,
                updatedJobListing,
            ).ok();
        } catch (error: any) {
            new SystemResponse(
                res,
                'error updating job listing!',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /jobs/{jobId}:
     *   delete:
     *     summary: Delete Job Listing by ID
     *     description: Delete a job listing based on the provided job ID.
     *     tags:
     *       - Job Listings
     *     parameters:
     *       - in: path
     *         name: jobId
     *         schema:
     *           type: string
     *         required: true
     *         description: The unique identifier for the job listing.
     *     responses:
     *       '200':
     *         description: Job listing deleted successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: Job deleted successfully.
     *               data:
     *                 jobId: 'jobId_value'
     *       '401':
     *         description: Unauthorized. User authentication failed.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: User authentication failed!
     *               error:
     *                 name: JsonWebTokenError
     *                 message: jwt must be provided
     *       '404':
     *         description: Not Found. No job found for the provided ID.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: No job found for the provided ID!
     *               data:
     *                 jobId: 'jobId_value'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Error deleting joblisting by id.
     *               error: {}
     */
    deleteById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { jobId } = req.params;
            await this.jobListingService.deleteById(jobId);

            logger.info(`joblisting with id:${jobId} deleted!`);

            new SystemResponse(res, 'Job deleted successfully!', {
                jobId,
            }).ok();
        } catch (error: unknown) {
            logger.error('error in deleteById API', error);

            new SystemResponse(
                res,
                'Error deleting joblisting by id!',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /jobs/upload:
     *   post:
     *     summary: Upload File
     *     description: Upload a file for bulk data processing.
     *     tags:
     *       - Job Listings
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: The file to be uploaded.
     *     responses:
     *       '201':
     *         description: File uploaded successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: File uploaded successfully.
     *               data:
     *                 filename: 'example.txt'
     *                 filePath: '/uploads/example.txt'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Internal Server Error!
     *               error: { error details }
     */
    uploadByFile = async (req: Request, res: Response): Promise<void> => {
        try {
            const filePath: string = req.file?.path ?? '';
            const filename: string = req.file?.originalname ?? '';

            const recordId: string = await this.jobListingService.writeBulkData(filename, filePath);
            new SystemResponse(res, 'File uploaded successfully', { recordId, file: req.file }).created();
        } catch (error: unknown) {
            new SystemResponse(
                res,
                'error uploading joblistings by csv file!',
                error,
            ).internalServerError();
        }
    };
}

export default JobListingController;
