import { expect } from '@jest/globals';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../../mocks/test-entity.interface';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DefaultFileDecoratorConfigInternal, ImageFileDecoratorConfigInternal } from './file-decorator-internal.data';
import { DefaultFileDecoratorConfig } from './file-decorator.data';
import { file } from './file.decorator';

const testEntity: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;

test('should have default file metadata', () => {
    const metadata: DefaultFileDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'fileValue', DecoratorTypes.FILE_DEFAULT);
    expect(metadata).toBeDefined();
    expect(metadata?.maxSize).toBe(10);
    expect(metadata?.maxSizeTotal).toBe(100);
    expect(metadata?.allowedMimeTypes).toEqual(['*']);
    expect(metadata?.multiple).toBe(false);
    expect(metadata?.dragAndDrop).toBe(false);
});

test('should have drag drop file metadata', () => {
    const metadata: DefaultFileDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'dragDropFileValue', DecoratorTypes.FILE_DEFAULT);
    expect(metadata).toBeDefined();
    expect(metadata?.maxSize).toBe(10);
    expect(metadata?.maxSizeTotal).toBe(100);
    expect(metadata?.allowedMimeTypes).toEqual(['*']);
    expect(metadata?.multiple).toBe(false);
    expect(metadata?.dragAndDrop).toBe(true);
});

test('should have custom files metadata', () => {
    const metadata: DefaultFileDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'customFileValues', DecoratorTypes.FILE_DEFAULT);
    expect(metadata).toBeDefined();
    expect(metadata?.maxSize).toBe(0.003);
    expect(metadata?.maxSizeTotal).toBe(0.005);
    expect(metadata?.allowedMimeTypes).toEqual(['image/*', 'application/pdf', 'application/x-javascript']);
    expect(metadata?.multiple).toBe(true);
    expect(metadata?.dragAndDrop).toBe(true);
});

test('should have default image metadata', () => {
    const metadata: ImageFileDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'imageValue', DecoratorTypes.FILE_IMAGE);
    expect(metadata).toBeDefined();
    expect(metadata?.allowedMimeTypes).toEqual(['image/*']);
    expect(metadata?.preview).toBe(false);
    expect(metadata?.previewPlaceholderUrl).toBe(undefined);
});

test('should have drag drop image metadata', () => {
    const metadata: ImageFileDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'imageDragDropValue', DecoratorTypes.FILE_IMAGE);
    expect(metadata).toBeDefined();
    expect(metadata?.allowedMimeTypes).toEqual(['image/*']);
    expect(metadata?.preview).toBe(true);
    expect(metadata?.previewPlaceholderUrl).toBe(undefined);
    expect(metadata?.dragAndDrop).toBe(true);
});

test('should have custom images metadata', () => {
    const metadata: ImageFileDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'customImageValues', DecoratorTypes.FILE_IMAGE);
    expect(metadata).toBeDefined();
    expect(metadata?.allowedMimeTypes).toEqual(['image/*']);
    expect(metadata?.preview).toBe(true);
    expect(metadata?.previewPlaceholderUrl).toBe(undefined);
});

test('should throw error when type is unknown', () => {
    expect(() => file({ type: 'wrong type' as 'other' | 'image' } as DefaultFileDecoratorConfig)).toThrow('Unknown metadata type wrong type');
});