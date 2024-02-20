/**
 * @swagger
 * components:
 *   schemas:
 *     JobListing:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the job listing.
 *         company:
 *           type: string
 *           description: The name of the company offering the job.
 *         logo:
 *           type: string
 *           description: The URL of the company's logo (optional).
 *         address:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               description: The city where the job is located.
 *             state:
 *               type: string
 *               description: The state where the job is located.
 *           description: The address details of the job location (optional).
 *         jobType:
 *           type: string
 *           enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Remote']
 *           description: The type of the job (optional).
 *         industry:
 *           type: string
 *           description: The industry of the job.
 *         description:
 *           type: string
 *           description: The description of the job (optional).
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of job requirements (optional).
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of job responsibilities (optional).
 *         qualifications:
 *           type: object
 *           properties:
 *             education:
 *               type: string
 *               description: The required education level for the job.
 *             minExperience:
 *               type: integer
 *               description: The minimum required experience for the job.
 *             maxExperience:
 *               type: integer
 *               description: The maximum allowed experience for the job.
 *             skills:
 *               type: array
 *               items:
 *                 type: string
 *               description: An array of required skills for the job.
 *           description: Qualifications required for the job (optional).
 *         salary:
 *           type: number
 *           description: The salary offered for the job (optional).
 *         applicationDeadline:
 *           type: string
 *           format: date-time
 *           description: The deadline for job applications.
 *         isRemote:
 *           type: boolean
 *           description: Indicates whether the job is remote or not.
 *         contactEmail:
 *           type: string
 *           format: email
 *           description: The contact email for job applications.
 *         applicationLink:
 *           type: string
 *           description: The link for applying to the job.
 *       required:
 *         - title
 *         - company
 *         - industry
 *         - applicationDeadline
 *         - isRemote
 *         - contactEmail
 *         - applicationLink
 */
