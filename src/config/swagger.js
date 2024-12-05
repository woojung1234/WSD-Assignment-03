const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Platform API',
      version: '1.0.0',
      description: 'API documentation for the Job Platform project',
    },
    servers: [
      {
        url: 'http://localhost:443',
        description: 'Development server',
      },
      {
        url: 'http://113.198.66.75:17080',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // 명시적으로 JWT 형식 지정
        },
      },
    },
    security: [
      {
        BearerAuth: [], // 모든 API에서 BearerAuth 적용
      },
    ],
  },
  apis: [`${__dirname}/../routes/*.js`], // 경로를 절대 경로로 설정
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
