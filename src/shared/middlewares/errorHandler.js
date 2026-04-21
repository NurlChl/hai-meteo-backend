import httpStatus from 'http-status';
import multer from 'multer';
import logger from '../config/logger.js';
import { MAX_MEDIA_FILE_SIZE_BYTES } from '../config/upload.js';

const errorHandler = (err, req, res, _next) => {
    let { statusCode, message } = err;

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        statusCode = httpStatus.REQUEST_ENTITY_TOO_LARGE;
        message = `File too large. Maximum upload size is ${Math.floor(MAX_MEDIA_FILE_SIZE_BYTES / (1024 * 1024))}MB.`;
    }

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
