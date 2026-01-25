import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockAuthRepository = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateLastLoginAt: jest.fn(),
};

jest.unstable_mockModule('../../src/shared/config/database.js', () => ({
    default: {},
}));
jest.unstable_mockModule('../../src/features/auth/auth.repository.js', () => mockAuthRepository);
jest.unstable_mockModule('../../src/shared/config/index.js', () => ({
    default: {
        jwt: {
            secret: 'test-secret-key-for-testing-purposes-only',
            accessExpirationMinutes: 30,
        },
        database: {
            url: 'postgresql://test:test@localhost:5432/test',
        },
    },
}));

const authService = await import('../../src/features/auth/auth.service.js');
const authRepository = mockAuthRepository;

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        const newUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        test('should create a new user and return user without password', async () => {
            const mockCreatedUser = {
                id: 1,
                name: newUser.name,
                email: newUser.email,
                passwordHash: 'hashedPassword',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            authRepository.getUserByEmail.mockResolvedValue(null);
            authRepository.createUser.mockResolvedValue(mockCreatedUser);

            const result = await authService.register(newUser);

            expect(authRepository.getUserByEmail).toHaveBeenCalledWith(newUser.email);
            expect(authRepository.createUser).toHaveBeenCalled();
            expect(result).not.toHaveProperty('passwordHash');
            expect(result.email).toBe(newUser.email);
            expect(result.name).toBe(newUser.name);
        });

        test('should throw error if email is already taken', async () => {
            authRepository.getUserByEmail.mockResolvedValue({ id: 1, email: newUser.email });

            await expect(authService.register(newUser)).rejects.toThrow(ApiError);
            await expect(authService.register(newUser)).rejects.toMatchObject({
                statusCode: httpStatus.BAD_REQUEST,
                message: 'Email already taken',
            });
        });

        test('should hash the password before saving', async () => {
            authRepository.getUserByEmail.mockResolvedValue(null);
            authRepository.createUser.mockImplementation((userData) => ({
                id: 1,
                ...userData,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await authService.register(newUser);

            const createUserCall = authRepository.createUser.mock.calls[0][0];
            expect(createUserCall.passwordHash).not.toBe(newUser.password);
            expect(await bcrypt.compare(newUser.password, createUserCall.passwordHash)).toBe(true);
        });
    });

    describe('loginUserWithEmailAndPassword', () => {
        const email = 'test@example.com';
        const password = 'password123';

        test('should return user without password if credentials are correct', async () => {
            const hashedPassword = await bcrypt.hash(password, 8);
            const mockUser = {
                id: 1,
                name: 'Test User',
                email,
                passwordHash: hashedPassword,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            authRepository.getUserByEmail.mockResolvedValue(mockUser);
            authRepository.updateLastLoginAt.mockResolvedValue(mockUser);

            const result = await authService.loginUserWithEmailAndPassword(email, password);

            expect(authRepository.updateLastLoginAt).toHaveBeenCalledWith(mockUser.id);
            expect(result).not.toHaveProperty('passwordHash');
            expect(result.email).toBe(email);
        });

        test('should return user when last login update returns null', async () => {
            const hashedPassword = await bcrypt.hash(password, 8);
            const mockUser = {
                id: 1,
                name: 'Test User',
                email,
                passwordHash: hashedPassword,
                isActive: true,
            };

            authRepository.getUserByEmail.mockResolvedValue(mockUser);
            authRepository.updateLastLoginAt.mockResolvedValue(null);

            const result = await authService.loginUserWithEmailAndPassword(email, password);

            expect(authRepository.updateLastLoginAt).toHaveBeenCalledWith(mockUser.id);
            expect(result).toMatchObject({ id: 1, email });
        });

        test('should throw error if user not found', async () => {
            authRepository.getUserByEmail.mockResolvedValue(null);

            await expect(authService.loginUserWithEmailAndPassword(email, password)).rejects.toThrow(
                ApiError
            );
            await expect(
                authService.loginUserWithEmailAndPassword(email, password)
            ).rejects.toMatchObject({
                statusCode: httpStatus.UNAUTHORIZED,
                message: 'Incorrect email or password',
            });
        });

        test('should throw error if password is incorrect', async () => {
            const mockUser = {
                id: 1,
                email,
                passwordHash: await bcrypt.hash('differentPassword', 8),
                isActive: true,
            };

            authRepository.getUserByEmail.mockResolvedValue(mockUser);

            await expect(
                authService.loginUserWithEmailAndPassword(email, password)
            ).rejects.toMatchObject({
                statusCode: httpStatus.UNAUTHORIZED,
                message: 'Incorrect email or password',
            });
        });

        test('should throw error if user is inactive', async () => {
            const hashedPassword = await bcrypt.hash(password, 8);
            const mockUser = {
                id: 1,
                email,
                passwordHash: hashedPassword,
                isActive: false,
            };

            authRepository.getUserByEmail.mockResolvedValue(mockUser);

            await expect(
                authService.loginUserWithEmailAndPassword(email, password)
            ).rejects.toMatchObject({
                statusCode: httpStatus.UNAUTHORIZED,
                message: 'User is inactive',
            });
        });
    });

    describe('generateTokens', () => {
        test('should generate valid access token', () => {
            const userId = 1;
            const tokens = authService.generateTokens(userId);

            expect(tokens).toHaveProperty('access');
            expect(tokens.access).toHaveProperty('token');
            expect(tokens.access).toHaveProperty('expires');
            expect(typeof tokens.access.token).toBe('string');
            expect(tokens.access.expires instanceof Date).toBe(true);
        });
    });

    describe('sanitizeUser', () => {
        test('should remove password from user object', () => {
            const user = {
                id: 1,
                name: 'Test',
                email: 'test@example.com',
                passwordHash: 'hashedPassword',
                isActive: true,
            };

            const result = authService.sanitizeUser(user);

            expect(result).not.toHaveProperty('passwordHash');
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('email');
        });

        test('should return null if user is null', () => {
            expect(authService.sanitizeUser(null)).toBeNull();
        });
    });
});
