import request, { Response } from 'supertest';
import express from 'express';
import CountryService from '../module/country/Service';
import Server from '../Server';
import { serverConfig } from '../config';
import ICountry from '../module/country/entities/ICountry';

describe('API Integration Tests - Country Module', () => {
    let server: Server;
    let app: express.Application;
    let countryService: CountryService;

    beforeAll(async () => {
        server = Server.getInstance(serverConfig);
        await server.connectDB();
        app = server.getApp();
        countryService = new CountryService();
    });

    afterAll(async () => {
        await server.disconnectDB();
    });

    beforeEach(async () => {
        await countryService.initialSeed();
    });

    afterEach(async () => {
        await server.connectDB();
        await countryService.deleteAll();
    });

    test('GET /country', async () => {
        const response: Response = await request(app).get('/country');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Country HomePage',
            data: {},
        });
    });

    test('GET country/:name', async () => {
        let response: Response = await request(app).get('/country/get/some-country');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: false,
            message: 'country not found!',
            error: {},
        });

        response = await request(app).get('/country/get/India');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'country found!',
            data: expect.objectContaining({}),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app).get('/country/get/India');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error retrieving country by name!',
            error: expect.objectContaining([]),
        });
    });

    test('GET country/getAll', async () => {
        let response: Response = await request(app).get('/country/getAll');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'country list found!',
            data: expect.objectContaining([]),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app).get('/country/getAll');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error retrieving all countries!',
            error: expect.objectContaining([]),
        });
    });

    test('POST country/create', async () => {
        const testCountry: ICountry = {
            name: 'Test Country',
            code: 'TS',
            continent: 'Test Continent',
            capital: 'Test Capital',
            population: 123456,
            language: 'english',
        };

        // Validation fail test
        let response: Response = await request(app).post('/country/create');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'new country validation failed!',
            error: expect.objectContaining([]),
        });

        // Successful create
        response = await request(app).post('/country/create').send(testCountry);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            status: true,
            message: 'new country added to database!',
            data: expect.objectContaining([]),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app).post('/country/create').send(testCountry);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error creating new country!',
            error: expect.objectContaining([]),
        });
    });
});
