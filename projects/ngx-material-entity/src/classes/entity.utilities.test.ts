import { TestEntityMockBuilder, TestEntity, getDatesBetween } from '../mocks/test-entity.mock';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { EntityUtilities } from './entity.utilities';
import { expect } from '@jest/globals';
import { ReflectUtilities } from '../capsulation/reflect.utilities';
import { LodashUtilities } from '../capsulation/lodash.utilities';
import { Entity } from 'ngx-material-entity';

const builder = new TestEntityMockBuilder();
const testEntity: TestEntity = builder.testEntity;
const testEntityWithoutData: TestEntity = builder.testEntityWithoutData;
const testEntityWithoutMetadata: TestEntity = builder.testEntityData;


/**
 * Checks whether or not a given value is an Entity.
 *
 * @param value - The value to check.
 * @returns Whether or not the given value is an Entity.
 */
function valueIsEntity(value: unknown): value is Entity {
    if (value && typeof value === 'object') {
        return ReflectUtilities.has(value, 'id' as keyof typeof value);
    }
    else {
        return false;
    }
}

describe('new', () => {
    test('should define all values for testEntity', async () => {
        for (const key of ReflectUtilities.ownKeys(testEntity)) {
            const value: unknown = ReflectUtilities.get(testEntity, key);
            expect(value).toBeDefined();
            if (valueIsEntity(value)) {
                for (const k of ReflectUtilities.ownKeys(value)) {
                    expect(ReflectUtilities.get(value, k)).toBeDefined();
                }
            }
        }
    });
    test('should not define any values for testEntityWithoutData', () => {
        for (const key of ReflectUtilities.ownKeys(testEntityWithoutData)) {
            const value: unknown = ReflectUtilities.get(testEntityWithoutData, key);
            if (valueIsEntity(value)) {
                for (const k of ReflectUtilities.ownKeys(value)) {
                    expect(ReflectUtilities.get(value, k)).toBeUndefined();
                }
            }
            else if (LodashUtilities.isArray(value)) {
                expect(ReflectUtilities.get(testEntityWithoutData, key)).toEqual([]);
            }
            else {
                expect(ReflectUtilities.get(testEntityWithoutData, key)).toBeUndefined();
            }
        }
    });
});

describe('getOmitForCreate', () => {
    test('should get correct omitForCreate values from metadata', async () => {
        expect(EntityUtilities.getOmitForCreate(testEntity)).toEqual(['id', 'omitForCreateValue']);
        expect(EntityUtilities.getOmitForCreate(testEntityWithoutData)).toEqual(['id', 'omitForCreateValue']);
    });
});

describe('getOmitForUpdate', () => {
    test('should get correct omitForUpdate values from metadata', async () => {
        expect(EntityUtilities.getOmitForUpdate(testEntity)).toEqual(['id', 'omitForUpdateValue']);
        expect(EntityUtilities.getOmitForUpdate(testEntityWithoutData)).toEqual(['id', 'omitForUpdateValue']);
    });
});

describe('getPropertyMetadata', () => {
    test('should get metadata', () => {
        expect(EntityUtilities.getPropertyMetadata(testEntity, 'omitForCreateValue', DecoratorTypes.STRING)).toBeDefined();
        expect(EntityUtilities.getPropertyMetadata(testEntityWithoutData, 'omitForCreateValue', DecoratorTypes.STRING)).toBeDefined();
    });
    test('should throw error for parameter without metadata', () => {
        // eslint-disable-next-line max-len
        const expectedEm: string = `Could not find metadata for property omitForCreateValue on the entity ${JSON.stringify(testEntityWithoutMetadata)}`;
        // eslint-disable-next-line max-len
        expect(() => EntityUtilities.getPropertyMetadata(testEntityWithoutMetadata, 'omitForCreateValue', DecoratorTypes.STRING)).toThrow(expectedEm);
    });
});

describe('getPropertyType', () => {
    test('should return correct type', () => {
        expect(EntityUtilities.getPropertyType(testEntity, 'omitForCreateValue')).toBe(DecoratorTypes.STRING);
    });
    test('should throw error for parameter without metadata', () => {
        // eslint-disable-next-line max-len
        const expectedEm: string = `Could not find type metadata for property omitForCreateValue on the entity ${JSON.stringify(testEntityWithoutMetadata)}`;
        expect(() => EntityUtilities.getPropertyType(testEntityWithoutMetadata, 'omitForCreateValue')).toThrow(expectedEm);
    });
});

describe('isEntityValid', () => {
    test('testEntity should be valid for create and update', () => {
        expect(EntityUtilities.isEntityValid(testEntity, 'create')).toBe(true);
        expect(EntityUtilities.isEntityValid(testEntity, 'update')).toBe(true);
    });
    test('testEntityWithoutData should be invalid for create and update', () => {
        expect(EntityUtilities.isEntityValid(testEntityWithoutData, 'create')).toBe(false);
        expect(EntityUtilities.isEntityValid(testEntityWithoutData, 'update')).toBe(false);
    });
    test('Optional value should not invalidate when set to undefined', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.optionalValue = undefined;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
        tE.optionalValue = 'optional';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING
    test('STRING maxLength', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.maxLengthStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthStringValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING minLength', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.minLengthStringValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthStringValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING regex', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.regexStringValue = '12345s';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.regexStringValue = '54321';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING_AUTOCOMPLETE
    test('STRING_AUTOCOMPLETE maxLength', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.maxLengthAutocompleteStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthAutocompleteStringValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE minLength', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.minLengthAutocompleteStringValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthAutocompleteStringValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE regex', () => {
        testEntity.regexAutocompleteStringValue = '12345s';
        expect(EntityUtilities.isEntityValid(testEntity, 'create')).toBe(false);
        testEntity.regexAutocompleteStringValue = '54321';
        expect(EntityUtilities.isEntityValid(testEntity, 'create')).toBe(true);
    });

    // STRING_TEXTBOX
    test('STRING_TEXTBOX maxLength', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.maxLengthTextboxStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthTextboxStringValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_TEXTBOX minLength', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.minLengthTextboxStringValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthTextboxStringValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // NUMBER
    test('NUMBER max', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.maxNumberValue = 11;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxNumberValue = 10;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('NUMBER min', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.minNumberValue = 9;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minNumberValue = 10;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // OBJECT
    test('OBJECT', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.objectValue.maxLengthStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.objectValue.maxLengthStringValue = '1234';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // ARRAY
    test('ARRAY', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.stringChipsArrayValue = [];
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.stringChipsArrayValue = ['1234'];
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // DATE
    test('DATE max', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateValue.setFullYear(2023);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateValue.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE min', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateValue.setFullYear(2021);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateValue.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE filter', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateValue.setDate(1);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateValue.setDate(2);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // DATE_RANGE
    test('DATE_RANGE undefined', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateRangeValue.start = undefined as unknown as Date;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start = new Date(testEntity.customDateRangeValue.start);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.customDateRangeValue.end = undefined as unknown as Date;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end = new Date(testEntity.customDateRangeValue.end);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE maxStart', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateRangeValue.start.setFullYear(2023);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE minStart', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateRangeValue.start.setFullYear(2021);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE maxEnd', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateRangeValue.end.setFullYear(2023);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE minEnd', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateRangeValue.end.setFullYear(2021);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE filter', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateRangeValue.start.setDate(1);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start.setDate(2);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.customDateRangeValue.end.setDate(1);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end.setDate(2);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.customDateRangeValue.values = [new Date(2022, 0, 1)];
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.values = getDatesBetween(new Date(tE.customDateRangeValue.start), new Date(tE.customDateRangeValue.end));
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // DATE_TIME
    test('DATE_TIME maxDate', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateTimeValue.setFullYear(2023);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME minDate', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateTimeValue.setFullYear(2021);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME filterDate', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateTimeValue.setDate(1);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setDate(2);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME maxHours', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateTimeValue.setHours(17);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME minHours', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateTimeValue.setHours(7);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.customDateTimeValue.setHours(8);
        tE.customDateTimeValue.setMinutes(0);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        tE.customDateTimeValue.setMinutes(30);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME filter', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        tE.customDateTimeValue.setHours(12);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // unknown metadata type
    test('should throw error for unknown metadata type', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('type', 'invalid type', tE, 'maxLengthStringValue');
        const expectedEm: string = 'Could not validate the input because the DecoratorType invalid type is not known';
        expect(() => EntityUtilities.isEntityValid(tE, 'create')).toThrow(expectedEm);
    });
});

describe('dirty', () => {
    test('should be able to tell if an entity was modified', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        const tEPriorChanges: TestEntity = LodashUtilities.cloneDeep(tE);
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);
        tE.minNumberValue = 1234;
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);
        expect(EntityUtilities.dirty(tE, undefined as never)).toBe(false);
    });
});

describe('compareOrder', () => {
    test('should sort entity properties by their order value', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        let keys: (keyof TestEntity)[] = EntityUtilities.keysOf(tE);
        expect(keys[0]).not.toBe('orderValue1');
        keys = keys.sort((a, b) => EntityUtilities.compareOrder(a, b, tE));
        expect(keys[0]).toBe('orderValue1');
        expect(keys[1]).toBe('orderValue2');
        expect(keys[2]).toBe('orderValue3');
    });
});

describe('getWidth', () => {
    test('should get the default width', () => {
        expect(EntityUtilities.getWidth(testEntity, 'maxLengthStringValue', 'lg')).toBe(6);
        expect(EntityUtilities.getWidth(testEntity, 'maxLengthStringValue', 'md')).toBe(6);
        expect(EntityUtilities.getWidth(testEntity, 'maxLengthStringValue', 'sm')).toBe(12);
    });
});

describe('resetChangesOnEntity', () => {
    test('should reset entity', () => {
        const tE: TestEntity = new TestEntity(testEntity);
        const tEPriorChanges: TestEntity = LodashUtilities.cloneDeep(tE);
        tE.minLengthStringValue = 'changed value';
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);
        EntityUtilities.resetChangesOnEntity(tE, tEPriorChanges);
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);
    });
});

describe('getEntityRows', () => {
    test('should get only one row when nothing is defined', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        expect(EntityUtilities.getEntityRows(tE)).toHaveLength(2);
    });
});

describe('keysOf', () => {
    test('should get all keys of the entity', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        expect(EntityUtilities.keysOf(tE)).toHaveLength(36);
    });
    test('should get keys without omitForCreate', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        const keysWithoutCreate = EntityUtilities.keysOf(tE, true);
        expect(keysWithoutCreate.includes('omitForCreateValue')).toBe(false);
        expect(keysWithoutCreate.includes('omitForUpdateValue')).toBe(true);
    });
    test('should get keys without omitForUpdate', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        const keysWithoutUpdate = EntityUtilities.keysOf(tE, false, true);
        expect(keysWithoutUpdate.includes('omitForUpdateValue')).toBe(false);
        expect(keysWithoutUpdate.includes('omitForCreateValue')).toBe(true);
    });
});