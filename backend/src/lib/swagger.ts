import swaggerJsdoc from 'swagger-jsdoc';

const options: any = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for Job-Nest app',
        },
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
    },
    apis: ['src/**/*.ts'], // Path to the file with your API documentation
};

const swaggerSpec: any = swaggerJsdoc(options);

export default swaggerSpec;
