import { expect } from '@jest/globals';

import { FileUtilities } from './file.utilities';

describe('getAcceptString', () => {
    test('getAcceptString', () => {
        const types: string[] = ['image/png', 'image/jpg'];
        expect(FileUtilities.getAcceptString(types)).toBe('image/png, image/jpg');
        expect(FileUtilities.getAcceptString()).toBe('*');
        expect(FileUtilities.getAcceptString([])).toBe('*');
    });
});

describe('isMimeTypeValid', () => {
    test('is single type valid', () => {
        expect(FileUtilities.isMimeTypeValid('image/png', ['image/png'])).toBe(true);
        expect(FileUtilities.isMimeTypeValid('image/png', ['image/jpg'])).toBe(false);
    });
    test('is generic type valid', () => {
        expect(FileUtilities.isMimeTypeValid('image/png', ['image/*'])).toBe(true);
        expect(FileUtilities.isMimeTypeValid('image/png', ['application/pdf'])).toBe(false);
        expect(FileUtilities.isMimeTypeValid('image/png', ['application/*'])).toBe(false);
    });
});

describe('transformToMegaBytes', () => {
    test('Bytes', () => {
        expect(FileUtilities.transformToMegaBytes(100, 'B')).toBe(0.0001);
    });
    test('Kilobytes', () => {
        expect(FileUtilities.transformToMegaBytes(100, 'KB')).toBe(0.1);
    });
    test('Gigabytes', () => {
        expect(FileUtilities.transformToMegaBytes(100, 'GB')).toBe(100000);
    });
});