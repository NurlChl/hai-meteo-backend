import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hai Meteo Backend API',
            version: '1.0.0',
            description: 'Hai Meteo Backend API',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        isActive: { type: 'boolean', example: true },
                        lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                AuthTokens: {
                    type: 'object',
                    properties: {
                        access: {
                            type: 'object',
                            properties: {
                                token: { type: 'string' },
                                expires: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },
                MediaAsset: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        fileUrl: { type: 'string', example: 'https://cdn.example.com/banner.png' },
                        altText: { type: 'string', example: 'Banner image' },
                        mimeType: { type: 'string', example: 'image/png' },
                        width: { type: 'integer', example: 1920 },
                        height: { type: 'integer', example: 1080 },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Page: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        slug: { type: 'string', example: 'home' },
                        title: { type: 'string', example: 'Home' },
                        metaTitle: { type: 'string', example: 'Hai Meteo - Home' },
                        metaDesc: { type: 'string', example: 'Hai Meteo company profile' },
                        isPublished: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                PageSection: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        pageId: { type: 'integer', example: 1 },
                        sectionKey: { type: 'string', example: 'hero' },
                        sectionType: { type: 'string', example: 'hero' },
                        sortOrder: { type: 'integer', example: 0 },
                        title: { type: 'string', example: 'Accurate Weather' },
                        subtitle: { type: 'string', example: 'Data-driven forecasts' },
                        content: { type: 'object', additionalProperties: true },
                        backgroundMediaId: { type: 'integer', nullable: true, example: 1 },
                        isEnabled: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                FAQ: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        question: { type: 'string', example: 'What is Hai Meteo?' },
                        answerMd: { type: 'string', example: 'Hai Meteo is a weather platform.' },
                        sortOrder: { type: 'integer', example: 0 },
                        isPublished: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                BlogCategory: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Insight' },
                        slug: { type: 'string', example: 'insight' },
                    },
                },
                BlogTag: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Forecast' },
                        slug: { type: 'string', example: 'forecast' },
                    },
                },
                BlogPost: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        slug: { type: 'string', example: 'weekly-weather' },
                        title: { type: 'string', example: 'Weekly Weather' },
                        excerpt: { type: 'string', example: 'This week\'s weather summary' },
                        contentMd: { type: 'string', example: '# Weekly Weather' },
                        coverMediaId: { type: 'integer', nullable: true, example: 1 },
                        authorName: { type: 'string', example: 'Admin' },
                        status: { type: 'string', example: 'published' },
                        publishedAt: { type: 'string', format: 'date-time', nullable: true },
                        categoryIds: {
                            type: 'array',
                            items: { type: 'integer' },
                            example: [1, 2],
                        },
                        tagIds: {
                            type: 'array',
                            items: { type: 'integer' },
                            example: [3, 4],
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                NavigationItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        location: { type: 'string', example: 'header' },
                        label: { type: 'string', example: 'Features' },
                        href: { type: 'string', example: '/features' },
                        iconMediaId: { type: 'integer', nullable: true, example: 1 },
                        sortOrder: { type: 'integer', example: 0 },
                        isEnabled: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                ContactMessage: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Alex' },
                        email: { type: 'string', format: 'email', example: 'alex@example.com' },
                        company: { type: 'string', example: 'Meteo Inc.' },
                        subject: { type: 'string', example: 'Partnership' },
                        message: { type: 'string', example: 'Interested in collaboration.' },
                        status: { type: 'string', example: 'new' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        code: { type: 'integer', example: 400 },
                        message: { type: 'string', example: 'Bad Request' },
                    },
                },
            },
        },
    },
    apis: ['./src/features/**/*.routes.js', './src/docs/*.js'],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
};

export default setupSwagger;
