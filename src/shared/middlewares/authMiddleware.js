import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import { adminUsers } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import db from '../config/database.js';
import config from '../config/index.js';

const auth = () => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, config.jwt.secret);
        const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, payload.sub));

        if (!user || !user.isActive) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
        }

        const userWithoutPassword = { ...user };
        delete userWithoutPassword.passwordHash;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        const jwtErrorNames = new Set(['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError']);
        if (error instanceof ApiError) {
            next(error);
        } else if (jwtErrorNames.has(error?.name)) {
            next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        } else {
            next(error);
        }
    }
};

export default auth;
