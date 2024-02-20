/* eslint-disable no-underscore-dangle */
import express from 'express';
import request, { Response } from 'supertest';
import Server from '../Server';
import { serverConfig } from '../config';
import UserService from '../module/user/Services';
import IUser from '../module/user/entities/IUser';
import BulkUploadService from '../module/bulkupload/Service';
import IBulkUpload from '../module/bulkupload/entities/IBulkUpload';

describe('API Integration Tests - User Module', () => {
    let server: Server;
    let app: express.Application;
    let bulkUploadService: BulkUploadService;
    let userToken: string;
    let testUser: IUser;

    beforeAll(async () => {
        server = Server.getInstance(serverConfig);
        await server.connectDB();
        app = server.getApp();
        bulkUploadService = new BulkUploadService();

        testUser = {
            name: 'Test User',
            email: `user@test-${Date.now()}.com`,
            password: 'pass@1234',
        };
    });

    afterAll(async () => {
        await server.disconnectDB();
    });

    beforeEach(async () => {
        userToken = await UserService.generateLoginToken(
            testUser,
            serverConfig.jwtSecret,
        );
    });

    afterEach(async () => {
        await server.connectDB();
        await bulkUploadService.deleteAll();
    });

    test('GET /bulk-upload', async () => {
        // No JWT-token provided
        let response: Response = await request(app).get('/bulk-upload');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: false,
            message: 'user authentication failed!',
            error: expect.objectContaining({ message: 'jwt must be provided' }),
        });

        // Malformed JWT-token
        response = await request(app)
            .get('/bulk-upload')
            .set('Authorization', 'Bearer malformed-token');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: false,
            message: 'user authentication failed!',
            error: expect.objectContaining({ message: 'jwt malformed' }),
        });

        // Creating hollow entry, this ensures we have at least
        // one record in database for getAll successful query,
        // 0 entries in database will cause 'This page doesn't exist' instead
        await bulkUploadService.generateHollowEntry('test.csv', 10);

        // Get all upload history
        response = await request(app)
            .get('/bulk-upload')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'upload history found!',
            data: expect.objectContaining([]),
        });

        // skip and limit exceeded total entries
        response = await request(app)
            .get('/bulk-upload')
            .set('Authorization', `Bearer ${userToken}`)
            .query({ page: '100', limit: '100' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'This page doesn\'t exist!',
            error: expect.objectContaining({ page: '100', limit: '100' }),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app)
            .get('/bulk-upload')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error retrieving bulk upload history!',
            error: expect.objectContaining({}),
        });
    });

    test('GET /bulk-upload/{uploadId}', async () => {
        const result: IBulkUpload = await bulkUploadService.generateHollowEntry(
            'test.csv',
            100,
        );
        // eslint-disable-next-line no-underscore-dangle
        const testuploadId: string = (result as any)._id.toString();

        // upload record found
        let response: Response = await request(app)
            .get(`/bulk-upload/${testuploadId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'upload history found successfully.',
            data: expect.objectContaining({ filename: 'test.csv' }),
        });

        // upload record not found
        const randomId: string = '5f8d5a4c7d5ae23a9c6bdc47';
        response = await request(app)
            .get(`/bulk-upload/${randomId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: false,
            message: 'No upload history found for the provided ID!',
            error: expect.objectContaining({ uploadId: randomId }),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app)
            .get(`/bulk-upload/${testuploadId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error retrieving upload history by uploadId!',
            error: expect.objectContaining({}),
        });
    });

    test('POST /bulk-upload', async () => {
        const hollowEntry: IBulkUpload = await bulkUploadService.generateHollowEntry('test.csv', 10);
        const {
            _id, createdAt, updatedAt, __v, ...testRecord
        } = (hollowEntry as any)._doc;

        // Validation failed
        let response: Response = await request(app).post('/bulk-upload');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'bulk-record validation failed!',
            error: expect.objectContaining({}),
        });

        // Record successfully created
        response = await request(app).post('/bulk-upload').send(testRecord);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            status: true,
            message: 'new upload history added!',
            data: expect.objectContaining({}),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app).post('/bulk-upload').send(testRecord);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error creating new bulk upload history!',
            error: expect.objectContaining({}),
        });
    });
});
