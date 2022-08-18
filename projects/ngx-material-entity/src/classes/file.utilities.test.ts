import { expect } from '@jest/globals';
import { FileUtilities } from './file.utilities';

describe('getAcceptString', () => {
    test('getAcceptString', async () => {
        const types: string[] = ['image/png', 'image/jpg'];
        expect(FileUtilities.getAcceptString(types)).toBe('image/png, image/jpg');
        expect(FileUtilities.getAcceptString()).toBe('*');
        expect(FileUtilities.getAcceptString([])).toBe('*');
    });
});

describe('isMimeTypeValid', () => {
    test('is single type valid', async () => {
        expect(FileUtilities.isMimeTypeValid('image/png', ['image/png'])).toBe(true);
        expect(FileUtilities.isMimeTypeValid('image/png', ['image/jpg'])).toBe(false);
    });
    test('is generic type valid', async () => {
        expect(FileUtilities.isMimeTypeValid('image/png', ['image/*'])).toBe(true);
        expect(FileUtilities.isMimeTypeValid('image/png', ['application/pdf'])).toBe(false);
        expect(FileUtilities.isMimeTypeValid('image/png', ['application/*'])).toBe(false);
    });
});

describe('transformToMegaBytes', () => {
    test('Bytes', async () => {
        expect(FileUtilities.transformToMegaBytes(100, 'B')).toBe(0.0001);
    });
    test('Kilobytes', async () => {
        expect(FileUtilities.transformToMegaBytes(100, 'KB')).toBe(0.1);
    });
    test('Gigabytes', async () => {
        expect(FileUtilities.transformToMegaBytes(100, 'GB')).toBe(100000);
    });
});