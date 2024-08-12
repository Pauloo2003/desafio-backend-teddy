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
            description: 'Documentação da API para o sistema de encurtamento de URLs, desenvolvido com Node.js e TypeScript',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Insira o token JWT gerado no login',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
});

export const setupSwagger = (app: Express) => {
    app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
