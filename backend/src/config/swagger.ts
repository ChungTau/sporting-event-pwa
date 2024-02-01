import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.1.0', // Specify the OpenAPI version
    info: {
      title: 'Sporting Event PWA API Documentation',
      version: '1.0.0',
      description: 'API documentation for Sporting Event PWA',
    },
  },
  apis: ['./routes/userRoutes.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
