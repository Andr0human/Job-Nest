import request, { Response } from 'supertest';
import express from 'express';
import Server from '../Server';
import { serverConfig } from '../config';

const token: string = serverConfig.dummyToken;

describe('API Integration Tests - Assignment3', () => {
    let server: Server;
    let app: express.Application;

    beforeAll(async () => {
        server = Server.getInstance(serverConfig);
        app = server.getApp();
    });

    test('GET /', async () => {
        const response: Response = await request(app).get('/assignment3');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Assignment-3 HomePage',
            data: {},
        });
    });

    test('GET /mock', async () => {
        let response: Response = await request(app).get('/assignment3/mock').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'user list found!',
            data: expect.objectContaining([]),
        });

        // JWT token not provided
        response = await request(app).get('/assignment3/mock').set('Authorization', 'Bearer');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: false,
            message: 'user authentication failed!',
            error: { name: 'JsonWebTokenError', message: 'jwt must be provided' },
        });
    });

    test('POST /add-user', async () => {
        const response: Response = await request(app).post('/assignment3/add-user');

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            status: true,
            message: 'new user created!',
            data: expect.objectContaining({}),
        });
    });

    test('GET /mock-log', async () => {
        const response: Response = await request(app).get('/assignment3/mock-log');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'user list found!',
            data: expect.objectContaining([]),
        });
    });

    test('GET /example', async () => {
        const response: Response = await request(app).get('/assignment3/example');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'some error occured!',
            error: {},
        });
    });

    test('GET /mock-log-auth', async () => {
        const response: Response = await request(app).get('/assignment3/mock-log-auth').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'user list found!',
            data: expect.objectContaining([]),
        });
    });

    test('GET /mock-header', async () => {
        const response: Response = await request(app).get('/assignment3/mock-header');

        expect(response.get('author')).toEqual('Ayush Sinha');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'user list found!',
            data: expect.objectContaining([]),
        });
    });

    test('GET /mock-rate', async () => {
        let response: Response = await request(app).get('/assignment3/mock-rate');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'user list found!',
            data: expect.objectContaining([]),
        });

        await request(app).get('/assignment3/mock-rate');
        response = await request(app).get('/assignment3/mock-rate');

        expect(response.status).toBe(429);
        expect(response.body).toEqual({
            status: false,
            message: 'Query limit exceeded! Please wait.',
            error: {},
        });
    });
});
