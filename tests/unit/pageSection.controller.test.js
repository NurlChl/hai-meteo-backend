import { jest } from '@jest/globals';

const mockPageSectionService = {
    getPageSections: jest.fn(),
};

jest.unstable_mockModule('../../src/features/pageSection/pageSection.service.js', () => mockPageSectionService);

const pageSectionController = await import('../../src/features/pageSection/pageSection.controller.js');

const createRes = () => {
    const res = {};
    res.send = jest.fn(() => res);
    res.status = jest.fn(() => res);
    return res;
};

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe('Page Section Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should coerce pageId and isEnabled from query strings', async () => {
        mockPageSectionService.getPageSections.mockResolvedValue({ results: [] });

        const req = { query: { pageId: '3', isEnabled: 'true' } };
        const res = createRes();
        const next = jest.fn();

        pageSectionController.getPageSections(req, res, next);
        await flushPromises();

        expect(mockPageSectionService.getPageSections).toHaveBeenCalledWith(
            expect.objectContaining({ pageId: 3, isEnabled: true })
        );
        expect(res.send).toHaveBeenCalledWith({ results: [] });
    });

    test('should keep boolean isEnabled and omit missing pageId', async () => {
        mockPageSectionService.getPageSections.mockResolvedValue({ results: [] });

        const req = { query: { isEnabled: false } };
        const res = createRes();
        const next = jest.fn();

        pageSectionController.getPageSections(req, res, next);
        await flushPromises();

        expect(mockPageSectionService.getPageSections).toHaveBeenCalledWith(
            expect.objectContaining({ pageId: undefined, isEnabled: false })
        );
        expect(res.send).toHaveBeenCalledWith({ results: [] });
    });
});
