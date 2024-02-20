import express from 'express';
import request, { Response } from 'supertest';
import { serverConfig } from '../config';
import IUser from '../module/user/entities/IUser';
import UserService from '../module/user/Services';
import Server from '../Server';

describe('API Integration Tests - User Module', () => {
    let server: Server;
    let app: express.Application;
    let userService: UserService;
    let userToken: string;
    let testUser: IUser;

    beforeAll(async () => {
        server = Server.getInstance(serverConfig);
        await server.connectDB();
        app = server.getApp();

        userService = new UserService();
        userService.deleteAll();

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
        await userService.initialSeed();
        userToken = await UserService.generateLoginToken(
            testUser,
            serverConfig.jwtSecret,
        );
    });

    afterEach(async () => {
        await server.connectDB();
        await userService.deleteAll();
    });

    test('GET /users', async () => {
        // No JWT-token provided
        let response: Response = await request(app).get('/users');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: false,
            message: 'user authentication failed!',
            error: expect.objectContaining({ message: 'jwt must be provided' }),
        });

        // Malformed JWT-token
        response = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer malformed-token');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: false,
            message: 'user authentication failed!',
            error: expect.objectContaining({ message: 'jwt malformed' }),
        });

        // Get all users
        response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'users list found!',
            data: expect.objectContaining([]),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error retrieving all users!',
            error: expect.objectContaining({}),
        });
    });

    test('GET /users/email/{emailId}', async () => {
        const invalidEmail: string = 'abc@xyz.com';
        const validEmail: string = 'john.doe@example.com';

        // user not found
        let response: Response = await request(app)
            .get(`/users/email/${invalidEmail}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: false,
            message: 'User not found!',
            error: expect.objectContaining({ emailId: invalidEmail }),
        });

        // user found
        response = await request(app)
            .get(`/users/email/${validEmail}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'User found!',
            data: expect.objectContaining({}),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app)
            .get(`/users/email/${validEmail}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error retrieving user by email!',
            error: expect.objectContaining({}),
        });
    });

    test('GET users/token', async () => {
        const result: IUser = await userService.create(testUser);
        // eslint-disable-next-line no-underscore-dangle
        const testUserId: string = (result as any)._id.toString();

        userToken = await UserService.generateLoginToken(result, serverConfig.jwtSecret);

        // user found
        let response: Response = await request(app)
            .get('/users/token')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'User found!',
            data: expect.objectContaining({}),
        });

        // user not found
        await userService.deleteById(testUserId);
        response = await request(app)
            .get('/users/token')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: false,
            message: 'User not found!',
            error: expect.objectContaining({ authorization: `Bearer ${userToken}` }),
        });

        // internal server error
        await server.disconnectDB();
        response = await request(app)
            .get('/users/token')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error retrieving user by token!',
            error: expect.objectContaining({}),
        });
    });

    test('POST /users/register', async () => {
        // Validation error
        let response: Response = await request(app).post('/users/register');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'new user validation failed!',
            error: expect.objectContaining({}),
        });

        // Password check failed (should be more than 8 chars)
        response = await request(app)
            .post('/users/register')
            .send({ ...testUser, password: 'pa@123' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'new user validation failed!',
            error: expect.objectContaining({}),
        });

        // Successful registration
        response = await request(app).post('/users/register').send(testUser);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            status: true,
            message: 'new user added!',
            data: expect.objectContaining({}),
        });

        // User already exists
        response = await request(app).post('/users/register').send(testUser);

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
            status: false,
            message: 'User already exists!',
            error: expect.objectContaining({}),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app).post('/users/register').send(testUser);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error creating new user!',
            error: expect.objectContaining({}),
        });
    });

    test('POST users/login', async () => {
        // Validation error
        let response: Response = await request(app).post('/users/login');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'login validation failed!',
            error: expect.objectContaining({}),
        });

        // No existing user
        response = await request(app).post('/users/login').send({
            email: 'abc@xyz.com',
            password: '123456780',
        });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: false,
            message: 'no user found for current email!',
            error: expect.objectContaining({}),
        });

        await userService.create(testUser);

        // Invalid credentials
        response = await request(app).post('/users/login').send({
            email: testUser.email,
            password: 'password123',
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: false,
            message: 'Invalid credentials!',
            error: expect.objectContaining({}),
        });

        // Successful login
        response = await request(app).post('/users/login').send({
            email: testUser.email,
            password: 'pass@1234',
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'user login successfully!',
            data: expect.objectContaining({}),
        });

        // Internal server error
        await server.disconnectDB();
        response = await request(app).post('/users/login').send({
            email: testUser.email,
            password: 'pass@1234',
        });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error logging existing user!',
            error: expect.objectContaining({}),
        });
    });

    test('GET users/{userId}', async () => {
        const result: IUser = await userService.create(testUser);
        // eslint-disable-next-line no-underscore-dangle
        const testUserId: string = (result as any)._id.toString();

        // userId validation failed
        let response: Response = await request(app)
            .get('/users/invalid-id')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'userId validation failed!',
            error: expect.objectContaining({}),
        });

        // user found
        response = await request(app)
            .get(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'User found successfully!',
            data: expect.objectContaining({}),
        });

        // user not found
        const randomId: string = '5f8d5a4c7d5ae23a9c6bdc47';
        response = await request(app)
            .get(`/users/${randomId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: false,
            message: 'No user found for the provided ID!',
            error: expect.objectContaining({ userId: randomId }),
        });

        // internal server error
        await server.disconnectDB();
        response = await request(app)
            .get(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'Error retrieving user by userId.',
            error: expect.objectContaining({}),
        });
    });

    test('PUT users/{userId}', async () => {
        const result: IUser = await userService.create(testUser);
        // eslint-disable-next-line no-underscore-dangle
        const testUserId: string = (result as any)._id.toString();

        // updated user validation failed
        let response: Response = await request(app)
            .put(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'updated user validation failed!',
            error: expect.objectContaining({}),
        });

        // user's email and password cannot be updated with update API once created
        response = await request(app)
            .put(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Updated test user',
                password: 'new_pass@123',
                email: 'new_user@test.com',
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'updated user validation failed!',
            error: expect.objectContaining({
                details: expect.objectContaining([
                    expect.objectContaining({ message: '"password" is not allowed' }),
                    expect.objectContaining({ message: '"email" is not allowed' }),
                ]),
            }),
        });

        // user update success
        response = await request(app)
            .put(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Updated test user',
                summary: 'Hello, this is test user!',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: `user with id:${testUserId} updated!`,
            data: expect.objectContaining({
                name: 'Updated test user',
                summary: 'Hello, this is test user!',
            }),
        });

        // internal server error
        await server.disconnectDB();
        response = await request(app)
            .put(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Updated test user' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'error updating user!',
            error: expect.objectContaining({}),
        });
    });

    test('DELETE users/{userId}', async () => {
        const result: IUser = await userService.create(testUser);
        // eslint-disable-next-line no-underscore-dangle
        const testUserId: string = (result as any)._id.toString();

        // user deleted successfully
        let response: Response = await request(app)
            .delete(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'User deleted successfully!',
            data: expect.objectContaining({}),
        });

        // internal server error
        await server.disconnectDB();
        response = await request(app)
            .delete(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'Error deleting user by id!',
            error: expect.objectContaining({}),
        });
    });
});
