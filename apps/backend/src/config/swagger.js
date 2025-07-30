import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesPath = path.resolve(__dirname, '../../routes/**/*.js');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PlaylistMaker API',
    version: '1.0.0',
    description: 'Documentação da API de PlaylistMaker',
  },
  servers: [
    {
      url: 'http://localhost:3901',
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [routesPath],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
