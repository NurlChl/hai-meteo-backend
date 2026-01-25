import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockContactMessageRepository = {
    createContactMessage: jest.fn(),
    getContactMessages: jest.fn(),
    getContactMessageById: jest.fn(),
    updateContactMessageById: jest.fn(),
    deleteContactMessageById: jest.fn(),
};

jest.unstable_mockModule('../../src/features/contactMessage/contactMessage.repository.js', () => mockContactMessageRepository);

const contactMessageService = await import('../../src/features/contactMessage/contactMessage.service.js');

describe('Contact Message Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should throw error when contact message is not found', async () => {
        mockContactMessageRepository.getContactMessageById.mockResolvedValue(null);

        await expect(contactMessageService.getContactMessageById(999)).rejects.toThrow(ApiError);
        await expect(contactMessageService.getContactMessageById(999)).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'Contact message not found',
        });
    });
});
