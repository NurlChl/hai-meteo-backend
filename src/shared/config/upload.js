import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

const MAX_MEDIA_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
];

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(httpStatus.BAD_REQUEST, 'Invalid file type. Only image and video files are allowed.'), false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: MAX_MEDIA_FILE_SIZE_BYTES,
    },
});

export { upload, allowedMimeTypes, MAX_MEDIA_FILE_SIZE_BYTES };
