import request, { Response } from 'supertest';
import express from 'express';
import Server from '../Server';
import { serverConfig } from '../config';

describe('API Integration Tests - Assignment5', () => {
    let server: Server;
    let app: express.Application;

    beforeAll(async () => {
        server = Server.getInstance(serverConfig);
        app = server.getApp();
    });

    test('GET /', async () => {
        const response: Response = await request(app).get('/assignment5');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Assignment-5 HomePage',
            data: {},
        });
    });

    test('GET /async-route', async () => {
        const response: Response = await request(app).get('/assignment5/async-route');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'Error fetching data!',
            error: {},
        });
    });

    test('POST /param-validation', async () => {
        // Validation failed
        let response: Response = await request(app).post('/assignment5/param-validation');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Validation error!',
            error: expect.objectContaining([]),
        });

        // Password length check failed
        response = await request(app).post('/assignment5/param-validation').send({
            name: 'ayushsinha',
            email: 'ayush@gmail.com',
            password: 'pas@123',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Validation error!',
            error: expect.objectContaining({
                details: expect.objectContaining([
                    expect.objectContaining({ message: 'Password must be at least 8 characters long' }),
                ]),
            }),
        });

        // Successful validation
        response = await request(app).post('/assignment5/param-validation').send({
            name: 'ayushsinha',
            email: 'ayush@gmail.com',
            password: 'Pass@1234',
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Validation successful!',
            data: expect.objectContaining([]),
        });
    });
});
