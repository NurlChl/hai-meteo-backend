import app from './src/app.js';
import config from './src/shared/config/index.js';
import logger from './src/shared/config/logger.js';

const EXIT_FAILURE = 1;

let server;

const startServer = () => {
    try {
        server = app.listen(config.port, () => {
            logger.info(`Listening to port ${config.port}`);
        });
    } catch (error) {
        logger.error(error);
        process.exit(EXIT_FAILURE);
    }
};

startServer();

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
