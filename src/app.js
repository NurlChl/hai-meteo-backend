import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import httpStatus from 'http-status';
import errorHandler from './shared/middlewares/errorHandler.js';
import { generalLimiter } from './shared/middlewares/rateLimiter.js';
import routes from './routes/index.js';
import ApiError from './shared/utils/ApiError.js';
import setupSwagger from './shared/config/swagger.js';
import config from './shared/config/index.js';

const app = express();

app.set('trust proxy', config.proxy.trust);

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(generalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

setupSwagger(app);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/v1', routes);

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorHandler);

export default app;
