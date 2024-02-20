/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           description: The user's password.
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: The user's date of birth (optional).
 *         gender:
 *           type: string
 *           enum: ['male', 'female', 'other']
 *           description: The user's gender (optional).
 *         phoneNumber:
 *           type: string
 *           description: The user's phone number (optional).
 *         summary:
 *           type: string
 *           description: The user's summary (optional).
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: The user's skills (optional).
 *         domains:
 *           type: array
 *           items:
 *             type: string
 *           description: The user's domains (optional).
 *         achievements:
 *           type: array
 *           items:
 *             type: string
 *           description: The user's achievements (optional).
 *         resume:
 *           type: string
 *           format: binary
 *           description: The user's resume as a binary buffer (optional).
 *       required:
 *         - name
 *         - email
 *         - password
 *
 *     UserRegisterRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           description: The user's password.
 *       required:
 *         - name
 *         - email
 *         - password

 *     UserLoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           description: The user's password.
 *       required:
 *         - email
 *         - password
 */
