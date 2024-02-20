import request, { Response } from 'supertest';
import express from 'express';
import Server from '../Server';
import { serverConfig } from '../config';

describe('API Integration Tests - Assignment4', () => {
    let server: Server;
    let app: express.Application;

    beforeAll(async () => {
        server = Server.getInstance(serverConfig);
        app = server.getApp();
    });

    test('GET /', async () => {
        const response: Response = await request(app).get('/assignment4');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Assignment-4 HomePage',
            data: {},
        });
    });

    test('POST /add-user', async () => {
        // Validation failed
        let response: Response = await request(app).post('/assignment4/add-user').send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'new user validation failed!',
            error: expect.objectContaining([]),
        });

        // Password length check failed
        response = await request(app).post('/assignment4/add-user').send({
            name: 'Ayush',
            email: 'ayush@gmail.com',
            password: 'pas@123',
            phoneNumber: '123456',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'new user validation failed!',
            error: expect.objectContaining({
                details: expect.objectContaining([
                    expect.objectContaining({ message: 'Password must be at least 8 characters long' }),
                ]),
            }),
        });

        // User successfully added
        response = await request(app).post('/assignment4/add-user').send({
            name: 'Ayush',
            email: 'ayush@gmail.com',
            password: 'pass@1234',
            phoneNumber: '123456',
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            status: true,
            message: 'new user created!',
            data: expect.objectContaining([]),
        });
    });

    test('POST /register', async () => {
        // Insufficient fields
        let response: Response = await request(app).post('/assignment4/register');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Validation failed! All fields are required.',
            error: {},
        });

        // Weak password
        response = await request(app).post('/assignment4/register').send({
            name: 'Ayush',
            email: 'ayush@gmail.com',
            password: 'pass12',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Weak password! It should have at least 8 characters, including uppercase, lowercase, and numbers',
            error: expect.objectContaining([]),
        });

        // Incorrect email format
        response = await request(app).post('/assignment4/register').send({
            name: 'Ayush',
            email: 'ayush@gmail',
            password: 'Pass@1234',
        });

        expect(response.body).toEqual({
            status: false,
            message: 'Incorrect email format!',
            error: expect.objectContaining([]),
        });

        // Correct input fields
        response = await request(app).post('/assignment4/register').send({
            name: 'Ayush',
            email: 'ayush@gmail.com',
            password: 'Pass@1234',
        });

        expect(response.body).toEqual({
            status: true,
            message: 'Registration successful!',
            data: expect.objectContaining([]),
        });
    });

    test('POST /add-item', async () => {
        // Insufficient fields
        let response: Response = await request(app).post('/assignment4/add-item');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Numeric validation failed! All fields are required.',
            error: {},
        });

        // Non-numeric fields
        response = await request(app).post('/assignment4/add-item').query({
            name: 'Phone',
            quantity: [1, 2, 3],
            price: 'some big amount!',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Invalid input. Quantity and price must be numeric values.',
            error: expect.objectContaining([]),
        });

        // Correct fields
        response = await request(app).post('/assignment4/add-item').query({
            name: 'Redmi phone',
            quantity: '42',
            price: '888.71',
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            status: true,
            message: 'Item successfully added to product list!',
            data: expect.objectContaining([]),
        });
    });

    test('GET /ip', async () => {
        // Ip validtion failed
        let response: Response = await request(app).get('/assignment4/ip');

        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            status: false,
            message: 'access denied! invalid IP address.',
            error: {},
        });

        // Ip validation successful
        app.enable('trust proxy');
        response = await request(app).get('/assignment4/ip').set('X-Forwarded-For', '::1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'IP test completed!',
        });
    });

    test('GET /registration', async () => {
        let response: Response = await request(app).get('/assignment4/registration');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'error occured in registration validation!',
            error: expect.objectContaining([]),
        });

        response = await request(app).get('/assignment4/registration').send({
            name: 'AyushSinha',
            email: 'ayush@gmail.com',
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'User registered successfully!',
        });
    });

    test('GET /product', async () => {
        let response: Response = await request(app).get('/assignment4/product');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'error occured in product validation!',
            error: expect.objectContaining([]),
        });

        response = await request(app).get('/assignment4/product').send({
            name: 'soap',
            price: '10.43',
            quantity: 27,
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Product added to list successfully!',
        });
    });
});
