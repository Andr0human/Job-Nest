import { Request, Response } from 'express';
import { serverConfig } from '../../config';
import { SystemResponse } from '../../lib/response-handler';

import logger from '../../lib/logger';
import IUser from './entities/IUser';
import IUserLoginRequest from './entities/IUserLoginRequest';
import UserService from './Services';

class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * @swagger
     * /users/getByEmail/{emailId}:
     *   get:
     *     summary: Get User by Email
     *     description: Retrieve a user by their email address.
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: emailId
     *         schema:
     *           type: string
     *         required: true
     *         description: The email address of the user.
     *     responses:
     *       '200':
     *         description: User found successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: User found!
     *               data:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       '404':
     *         description: Not Found. No user found for the provided email.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: User not found!
     *               data:
     *                 emailId: 'example@example.com'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Error retrieving user by email.
     *               error: {}
     */
    getByEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const { emailId } = req.params;
            const user: IUser | null = await this.userService.getByEmail(emailId);

            if (!user) {
                new SystemResponse(res, 'User not found!', req.params).notFound();
                return;
            }

            new SystemResponse(res, 'User found!', user).ok();
        } catch (error: unknown) {
            logger.error('error in getByEmail API', error);

            new SystemResponse(
                res,
                'error retrieving user by email!',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Retrieve all users
     *     description: Returns a list of all users in the system.
     *     tags:
     *       - Users
     *     responses:
     *       '200':
     *         description: A list of users.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: Users list retrieved successfully.
     *               data: []
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
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Internal Server Error.
     *               error: {}
     */
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const userList: IUser[] | null = await this.userService.getAll();
            new SystemResponse(res, 'users list found!', userList).ok();
        } catch (error: unknown) {
            logger.error('error in getAll API', error);

            new SystemResponse(
                res,
                'error retrieving all users!',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /users/register:
     *   post:
     *     summary: Register a new user
     *     description: Creates a new user account with the provided details.
     *     tags:
     *       - Users
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserRegisterRequest'
     *     responses:
     *       '201':
     *         description: User created successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: User created successfully.
     *               data: { new user details }
     *       '400':
     *         description: Bad Request. Invalid input or validation failed.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: New user validation failed.
     *               error: { Validation error details }
     *       '409':
     *         description: Conflict. User with the provided email already exists.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: User already exists.
     *               data: { new user details }
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Internal Server Error.
     *               error: {}
     */
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const newUser: IUser = req.body;

            // Check for existing user
            const existingUser: IUser | null = await this.userService.getByEmail(
                newUser.email,
            );

            if (existingUser) {
                new SystemResponse(res, 'User already exists!', newUser).conflict();
                return;
            }

            await this.userService.create(newUser);
            new SystemResponse(res, 'new user added!', newUser).created();
        } catch (error: any) {
            logger.error('error in register API', error);

            new SystemResponse(
                res,
                'error creating new user!',
                error.message,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /users/login:
     *   post:
     *     summary: User Login
     *     description: Logs in an existing user with valid credentials.
     *     tags:
     *       - Users
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserLoginRequest'
     *     responses:
     *       '200':
     *         description: User logged in successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: User logged in successfully.
     *               data:
     *                 token: jwt_token
     *                 user:
     *                   $ref: '#/components/schemas/IUser'
     *       '400':
     *         description: Bad Request. Invalid input or validation failed.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: User validation failed.
     *               error: { validation error details }
     *       '404':
     *         description: Not Found. No user found for the provided email.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: No user found for the provided email.
     *               data:
     *                 user:
     *                   $ref: '#/components/schemas/UserLoginRequest'
     *       '401':
     *         description: Unauthorized. Invalid credentials.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Invalid credentials.
     *               data:
     *                 user:
     *                   $ref: '#/components/schemas/UserLoginRequest'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Internal Server Error.
     *               error: {}
     */
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const user: IUserLoginRequest = req.body;

            // User exist check
            const existingUser: IUser | null = await this.userService.getByEmail(user.email);

            if (!existingUser) {
                new SystemResponse(res, 'no user found for current email!', user).notFound();
                return;
            }

            // Correct password check
            const comparePassword: boolean = await UserService.verifyPassword(existingUser, user);
            if (!comparePassword) {
                new SystemResponse(res, 'Invalid credentials!', user).unauthorized();
                return;
            }

            const token: string = await UserService.generateLoginToken(
                existingUser,
                serverConfig.jwtSecret,
            );

            new SystemResponse(res, 'user login successfully!', { token, existingUser }).ok();
        } catch (error: any) {
            new SystemResponse(
                res,
                'error logging existing user!',
                error.message,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /users/token:
     *   get:
     *     summary: Get User by Token
     *     description: Retrieves the user based on the provided authorization token in the header.
     *     tags:
     *       - Users
     *     responses:
     *       '200':
     *         description: User found successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: User found!
     *               data:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       '401':
     *         description: Unauthorized. Invalid or missing authorization token.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Unauthorized. Invalid or missing authorization token.
     *               data: {}
     *       '404':
     *         description: Not Found. No user found for the provided ID token.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: User not found!
     *               data: {}
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Internal Server Error.
     *               error: {}
     */
    getByToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.body;
            const fields: string = '_id email';
            const user: IUser | null = await this.userService.getById(userId, fields);

            if (!user) {
                new SystemResponse(res, 'User not found!', req.headers).notFound();
                return;
            }

            new SystemResponse(res, 'User found!', user).ok();
        } catch (error: unknown) {
            logger.error('error in getByToken API', error);

            new SystemResponse(
                res,
                'error retrieving user by token!',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /users/{userId}:
     *   get:
     *     summary: Get User by ID
     *     description: Retrieve a user based on the provided user ID.
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: The unique identifier for the user.
     *     responses:
     *       '200':
     *         description: User retrieved successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: User found successfully.
     *               data:
     *                 user:
     *                   $ref: '#/components/schemas/User'
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
     *         description: Not Found. No user found for the provided ID.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: No user found for the provided ID!
     *               data:
     *                 userId: 'userId_value'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Error retrieving user by userId.
     *               error: {}
     */
    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const fields: string = '-__v';
            const user: IUser | null = await this.userService.getById(userId, fields);

            if (!user) {
                new SystemResponse(res, 'No user found for the provided ID!', {
                    userId,
                }).notFound();
                return;
            }

            new SystemResponse(res, 'User found successfully!', user).ok();
        } catch (error: unknown) {
            logger.error('error in getById', error);

            new SystemResponse(
                res,
                'Error retrieving user by userId.',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /users/{userId}:
     *   put:
     *     summary: Update User by ID
     *     description: Update a user based on the provided user ID.
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: The unique identifier for the user.
     *       - in: body
     *         name: user
     *         description: The updated user data.
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/User'
     *     responses:
     *       '200':
     *         description: User updated successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: User with ID updated successfully.
     *               data:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       '400':
     *         description: Bad Request. Validation failed for updated user data.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Updated user validation failed!
     *               errors:
     *                 - field: 'fieldName'
     *                   message: 'Error message for the field'
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
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Error updating user by userId.
     *               error: {}
     */
    updateById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const newUser: IUser = req.body;

            await this.userService.updateById(userId, newUser);
            new SystemResponse(res, `user with id:${userId} updated!`, newUser).ok();
        } catch (error: any) {
            new SystemResponse(
                res,
                'error updating user!',
                error,
            ).internalServerError();
        }
    };

    /**
     * @swagger
     * /users/{userId}:
     *   delete:
     *     summary: Delete User by ID
     *     description: Delete a user based on the provided user ID.
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: The unique identifier for the user.
     *     responses:
     *       '200':
     *         description: User deleted successfully.
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: User with ID deleted successfully.
     *               data:
     *                 userId: 'userId_value'
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
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             example:
     *               success: false
     *               message: Error deleting user by userId.
     *               error: {}
     */
    deleteById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            await this.userService.deleteById(userId);

            logger.info(`user with id:${userId} deleted!`);

            new SystemResponse(res, 'User deleted successfully!', {
                userId,
            }).ok();
        } catch (error: unknown) {
            logger.error('error in deleteById API', error);

            new SystemResponse(
                res,
                'Error deleting user by id!',
                error,
            ).internalServerError();
        }
    };
}

export default UserController;
