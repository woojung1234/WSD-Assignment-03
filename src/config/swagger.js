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
      schemas: {
        Bookmark: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64d9f2b2a3c9c2340e123456',
            },
            user: {
              type: 'string',
              description: 'User ID who bookmarked the job',
              example: '64d9f2b2a3c9c2340e654321',
            },
            job: {
              type: 'string',
              description: 'ID of the job posting that is bookmarked',
              example: '64d9f2b2a3c9c2340e789012',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the bookmark was created',
              example: '2024-12-01T10:15:30Z',
            },
          },
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