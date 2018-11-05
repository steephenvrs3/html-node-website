// import { get as getConfig } from 'config';

let swaggerSpec: any = null;

// if (process.env.TESTING !== 'true') {
const swaggerJSDoc = require('swagger-jsdoc'); // tslint:disable-line

const options = {
  swaggerDefinition: {
    info: {
      title: 'CMA Backend',
      version: '1.0.0',
      description: '',
    },
    // host: getConfig('docsUrl'),
    basePath: '/v1',
  },
  apis: ['**/*.docs.yaml'],
};
swaggerSpec = swaggerJSDoc(options);
// }

export { swaggerSpec };
