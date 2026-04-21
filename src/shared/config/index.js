import Joi from 'joi';
import 'dotenv/config';

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required().description('PostgreSQL connection URL'),
    JWT_SECRET: Joi.string().min(32).required().description('JWT secret key (min 32 characters)'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('Access token expiration in minutes'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('Refresh token expiration in days'),
    BASE_URL: Joi.string().default('http://localhost:3000').description('Base URL for the API'),
    GCS_BUCKET_NAME: Joi.when('NODE_ENV', {
        is: 'test',
        then: Joi.string().optional(),
        otherwise: Joi.string().required(),
    }),
    GCS_PROJECT_ID: Joi.when('NODE_ENV', {
        is: 'test',
        then: Joi.string().optional(),
        otherwise: Joi.string().required(),
    }),
    GCS_KEY_FILENAME: Joi.when('NODE_ENV', {
        is: 'test',
        then: Joi.string().optional(),
        otherwise: Joi.string().required(),
    }),
    GCS_PUBLIC_BASE_URL: Joi.string().optional(),
    GCS_UPLOAD_PATH_PREFIX: Joi.string().default('media-assets'),
    GCS_SIGNED_URL_EXPIRES_MINUTES: Joi.number().integer().min(1).default(60),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    baseUrl: envVars.BASE_URL,
    database: {
        url: envVars.DATABASE_URL,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    gcs: {
        bucketName: envVars.GCS_BUCKET_NAME,
        projectId: envVars.GCS_PROJECT_ID,
        keyFilename: envVars.GCS_KEY_FILENAME,
        publicBaseUrl: envVars.GCS_PUBLIC_BASE_URL,
        uploadPathPrefix: envVars.GCS_UPLOAD_PATH_PREFIX,
        signedUrlExpiresMinutes: envVars.GCS_SIGNED_URL_EXPIRES_MINUTES,
    },
};
