import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { EntityUtilities } from './entity.utilities';
import { expect } from '@jest/globals';
import { ReflectUtilities } from '../capsulation/reflect.utilities';
import { LodashUtilities } from '../capsulation/lodash.utilities';
import { Entity } from '../classes/entity.model';
import { getDatesBetween, TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../mocks/test-entity.interface';

const builder = new TestEntityWithoutCustomPropertiesMockBuilder();
const testEntity: TestEntityWithoutCustomProperties = builder.testEntity;
const testEntityWithoutData: TestEntityWithoutCustomProperties = builder.testEntityWithoutData;
const testEntityWithoutMetadata: TestEntityWithoutCustomProperties = builder.testEntityData;

/**
 * Checks whether or not a given value is an Entity.
 *
 * @param value - The value to check.
 * @returns Whether or not the given value is an Entity.
 */
function valueIsEntity(value: unknown): value is Entity {
    if (value != null && typeof value === 'object') {
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
        expect(EntityUtilities.getOmitForCreate(testEntity)).toEqual(['id', 'omitForCreateValue', 'customFileValues']);
        expect(EntityUtilities.getOmitForCreate(testEntityWithoutData)).toEqual(['id', 'omitForCreateValue', 'customFileValues']);
    });
});

describe('getFileProperties', () => {
    test('should get all file property keys from the entity', async () => {
        expect(EntityUtilities.getFileProperties(testEntity)).toEqual([
            'fileValue',
            'dragDropFileValue',
            'customFileValues',
            'imageValue',
            'imageDragDropValue',
            'customImageValues'
        ]);
        expect(EntityUtilities.getFileProperties(testEntityWithoutData)).toEqual([
            'fileValue',
            'dragDropFileValue',
            'customFileValues',
            'imageValue',
            'imageDragDropValue',
            'customImageValues'
        ]);
    });
});

describe('getOmitForUpdate', () => {
    test('should get correct omitForUpdate values from metadata', async () => {
        expect(EntityUtilities.getOmitForUpdate(testEntity)).toEqual(['id', 'omitForUpdateValue', 'customFileValues']);
        expect(EntityUtilities.getOmitForUpdate(testEntityWithoutData)).toEqual(['id', 'omitForUpdateValue', 'customFileValues']);
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
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.optionalValue = undefined;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
        tE.optionalValue = 'optional';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // BOOLEAN
    test('BOOLEAN_CHECKBOX BOOLEAN_TOGGLE required', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.booleanCheckboxValue = false;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.booleanCheckboxValue = true;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.booleanToggleValue = false;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.booleanToggleValue = true;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING
    test('STRING maxLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.maxLengthStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthStringValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING minLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.minLengthStringValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthStringValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING regex', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.regexStringValue = '12345s';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.regexStringValue = '54321';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING_AUTOCOMPLETE
    test('STRING_AUTOCOMPLETE maxLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.maxLengthAutocompleteStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthAutocompleteStringValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE minLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
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
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.maxLengthTextboxStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthTextboxStringValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_TEXTBOX minLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.minLengthTextboxStringValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthTextboxStringValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING_PASSWORD
    test('STRING_PASSWORD maxLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.passwordString = '1234567891011';
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.passwordString = '12345678';
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_PASSWORD minLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.passwordString = '1234567';
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.passwordString = '12345678';
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_PASSWORD regex', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.passwordString = 'ABCDEFGH';
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.passwordString = 'ABCDEFGH1';
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_PASSWORD not confirmed', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString + 's', tE, 'passwordString');
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // NUMBER
    test('NUMBER max', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.maxNumberValue = 11;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxNumberValue = 10;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('NUMBER min', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.minNumberValue = 9;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minNumberValue = 10;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // OBJECT
    test('OBJECT', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.objectValue.maxLengthStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.objectValue.maxLengthStringValue = '1234';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // ARRAY
    test('ARRAY', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.stringChipsArrayValue = [];
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.stringChipsArrayValue = ['1234'];
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // DATE
    test('DATE max', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateValue.setFullYear(2023);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateValue.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE min', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateValue.setFullYear(2021);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateValue.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE filter', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateValue.setDate(1);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateValue.setDate(2);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // DATE_RANGE
    test('DATE_RANGE undefined', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
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
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateRangeValue.start.setFullYear(2023);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE minStart', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateRangeValue.start.setFullYear(2021);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE maxEnd', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateRangeValue.end.setFullYear(2023);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE minEnd', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateRangeValue.end.setFullYear(2021);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE filter', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
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
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateTimeValue.setFullYear(2023);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME minDate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateTimeValue.setFullYear(2021);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setFullYear(2022);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME filterDate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateTimeValue.setDate(1);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setDate(2);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME maxHours', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateTimeValue.setHours(17);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME minHours', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
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
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.customDateTimeValue.setHours(12);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // FILE
    test('FILE missing name', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.fileValue.name = undefined as unknown as string;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.fileValue.name = '6qW2XkuI_400x400.png';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('FILE missing file and url', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.fileValue.file = undefined;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
        tE.fileValue.url = undefined;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);

        tE.fileValue.file = testEntity.fileValue.file;
        tE.fileValue.url = testEntity.fileValue.url;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('FILE mimetype invalid', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.imageValue.type = 'application/pdf';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.imageValue.type = 'image/jpg';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('FILE single size invalid', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.fileValue.size = 10000001;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.fileValue.size = 10000000;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('FILE multi size invalid', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        for (let i = 0; i < 10; i++) {
            tE.customImageValues.push(
                {
                    url: 'http://localhost:3000/file/',
                    name: '6qW2XkuI_400x400.png',
                    type: 'image/jpg',
                    size: 10000000,
                }
            );
        }
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customImageValues = testEntity.customImageValues;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // CUSTOM
    test('CUSTOM isValid', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        tE.randomValue = '123456';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.randomValue = '42';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // unknown metadata type
    test('should throw error for unknown metadata type', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        ReflectUtilities.defineMetadata('type', 'invalid type', tE, 'maxLengthStringValue');
        const expectedEm: string = 'Could not validate the input because the DecoratorType invalid type is not known';
        expect(() => EntityUtilities.isEntityValid(tE, 'create')).toThrow(expectedEm);
    });
});

describe('dirty', () => {
    test('should be able to tell if an entity was modified', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(tE);
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);
        tE.minNumberValue = 1234;
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);
        expect(await EntityUtilities.dirty(tE, undefined as never)).toBe(false);
    });
    test('should tell if date range array is dirty', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(tE);
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);

        tE.dateRangeArrayValue[0].start = new Date();
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);

        tE.dateRangeArrayValue[0].start = testEntity.dateRangeArrayValue[0].start;
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);

        tE.dateRangeArrayValue.push({start: new Date(), end: new Date()});
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);

        tE.dateRangeArrayValue = testEntity.dateRangeArrayValue;
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);
    });
    test('should tell if custom value is dirty', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        tE.randomValue = '12345';
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);
        tE.randomValue = '42';
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);
    });
});

describe('compareOrder', () => {
    test('should sort entity properties by their order value', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        let keys: (keyof TestEntityWithoutCustomProperties)[] = EntityUtilities.keysOf(tE);
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
    test('should reset entity', async () => {
        const tE: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomProperties(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(tE);
        tE.minLengthStringValue = 'changed value';
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);
        EntityUtilities.resetChangesOnEntity(tE, tEPriorChanges);
        expect(await EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);
    });
});

describe('getEntityRows', () => {
    test('should get only one row when nothing is defined', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        expect(EntityUtilities.getEntityRows(tE)).toHaveLength(2);
    });
});

describe('keysOf', () => {
    test('should get all keys of the entity', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        expect(EntityUtilities.keysOf(tE)).toHaveLength(50);
    });
    test('should get keys without omitForCreate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        const keysWithoutCreate = EntityUtilities.keysOf(tE, true);
        expect(keysWithoutCreate.includes('omitForCreateValue')).toBe(false);
        expect(keysWithoutCreate.includes('omitForUpdateValue')).toBe(true);
    });
    test('should get keys without omitForUpdate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString, tE, 'passwordString');
        const keysWithoutUpdate = EntityUtilities.keysOf(tE, false, true);
        expect(keysWithoutUpdate.includes('omitForUpdateValue')).toBe(false);
        expect(keysWithoutUpdate.includes('omitForCreateValue')).toBe(true);
    });
});