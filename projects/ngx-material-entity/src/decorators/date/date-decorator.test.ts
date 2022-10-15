/* eslint-disable max-len */
import { expect } from '@jest/globals';
import { EntityUtilities } from '../../classes/entity.utilities';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../../mocks/test-entity.interface';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DateRangeDateDecoratorConfigInternal, DateTimeDateDecoratorConfigInternal, DefaultDateDecoratorConfigInternal } from './date-decorator-internal.data';

const testEntity: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;

test('should have date metadata', () => {
    const metadata: DefaultDateDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(testEntity, 'dateValue', DecoratorTypes.DATE);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('date');
});

test('should have dateRange metadata', () => {
    const metadata: DateRangeDateDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(testEntity, 'dateRangeValue', DecoratorTypes.DATE_RANGE);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('daterange');
});

test('should have dateTime metadata', () => {
    const metadata: DateTimeDateDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(testEntity, 'dateTimeValue', DecoratorTypes.DATE_TIME);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('datetime');
});

test('should have custom dateTime metadata', () => {
    const metadata: DateTimeDateDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(testEntity, 'customDateTimeValue', DecoratorTypes.DATE_TIME);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('datetime');
});