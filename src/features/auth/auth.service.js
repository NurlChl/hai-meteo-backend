import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authRepository from './auth.repository.js';
import ApiError from '../../shared/utils/ApiError.js';
import config from '../../shared/config/index.js';

const sanitizeUser = (user) => {
    if (!user) {
        return null;
    }
    const sanitized = { ...user };
    delete sanitized.passwordHash;
    return sanitized;
};

const register = async (userBody) => {
    if (await authRepository.getUserByEmail(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const hashedPassword = await bcrypt.hash(userBody.password, 8);
    const userData = { ...userBody };
    delete userData.password;
    const user = await authRepository.createUser({ ...userData, passwordHash: hashedPassword });
    return sanitizeUser(user);
};

const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await authRepository.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (!user.isActive) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User is inactive');
    }
    const updatedUser = await authRepository.updateLastLoginAt(user.id);
    return sanitizeUser(updatedUser || user);
};

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ sub: userId }, config.jwt.secret, {
        expiresIn: config.jwt.accessExpirationMinutes + 'm',
    });
    return {
        access: {
            token: accessToken,
            expires: new Date(Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000),
        },
    };
};

export {
    register,
    loginUserWithEmailAndPassword,
    generateTokens,
    sanitizeUser,
};
