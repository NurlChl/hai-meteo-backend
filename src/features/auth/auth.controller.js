import httpStatus from 'http-status';
import * as authService from './auth.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';

const register = catchAsync(async (req, res) => {
    const user = await authService.register(req.body);
    const tokens = authService.generateTokens(user.id);
    res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = authService.generateTokens(user.id);
    res.send({ user, tokens });
});

const getMe = catchAsync(async (req, res) => {
    await res.send(req.user);
});

export {
    register,
    login,
    getMe,
};
