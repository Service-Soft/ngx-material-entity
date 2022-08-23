import { expect } from '@jest/globals';
import { EntityUtilities } from '../../classes/entity.utilities';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../../mocks/test-entity.interface';
import { DecoratorTypes } from '../base/decorator-types.enum';

const testEntity: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;

test('should have date metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(testEntity, 'dateValue', DecoratorTypes.DATE);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('date');
});

test('should have dateRange metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(testEntity, 'dateRangeValue', DecoratorTypes.DATE_RANGE);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('daterange');
});

test('should have dateTime metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(testEntity, 'dateTimeValue', DecoratorTypes.DATE_TIME);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('datetime');
});

test('should have custom dateTime metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(testEntity, 'customDateTimeValue', DecoratorTypes.DATE_TIME);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('datetime');
});