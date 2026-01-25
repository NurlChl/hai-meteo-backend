import httpStatus from 'http-status';
import logger from '../config/logger.js';

const errorHandler = (err, req, res, _next) => {
    let { statusCode, message } = err;

    if (!statusCode) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[statusCode] || 'Internal Server Error';
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === 'development') {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};

export default errorHandler;
