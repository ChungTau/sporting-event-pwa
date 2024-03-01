//@ts-ignore
import swaggerAutogen from 'swagger-autogen';
import path from 'path';

const outputFile = path.join(__dirname, 'swagger_output.json');
const endpointsFiles = [path.join(__dirname, '../routes/userRoutes.ts')];

const options = {
  info: {
    title: 'Sporting Event PWA API Documentation',
    version: '1.0.0',
    description: 'API documentation for Sporting Event PWA',
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: ''
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer'
      }
    }
  }
};

swaggerAutogen()(outputFile, endpointsFiles, options);