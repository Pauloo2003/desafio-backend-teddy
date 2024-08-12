import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Configuração do Swagger
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sistema Encurtador de URL',
            version: '1.0.0',
            description: 'API Documentation for Node.js API built with TypeScript',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token with Bearer prefix',
                },
            },
        },
        servers: [
            { url: `https://desafio-backend.up.railway.app`, description: 'Server Produção' },
            { url: `${process.env.URL_DEV}:${process.env.PORT}`, description: 'Server Local' },
        ],
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
});

export const setupSwagger = (app: Express) => {
    app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
