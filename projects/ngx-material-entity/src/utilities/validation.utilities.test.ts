import { expect } from '@jest/globals';
import { PropertyDecoratorConfigInternal } from '../decorators/base/property-decorator-internal.data';
import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../encapsulation/reflect.utilities';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder, getDatesBetween } from '../mocks/test-entity.interface';
import { EntityUtilities } from './entity.utilities';
import { ValidationUtilities } from './validation.utilities';

const builder: TestEntityWithoutCustomPropertiesMockBuilder = new TestEntityWithoutCustomPropertiesMockBuilder();
const testEntity: TestEntityWithoutCustomProperties = builder.testEntity;
const testEntityWithoutData: TestEntityWithoutCustomProperties = builder.testEntityWithoutData;

describe('isEntityValid', () => {
    test('testEntity should be valid for create and update', () => {
        expect(ValidationUtilities.isEntityValid(testEntity, 'create')).toBe(true);
        expect(ValidationUtilities.isEntityValid(testEntity, 'update')).toBe(true);
    });
    test('testEntityWithoutData should be invalid for create and update', () => {
        expect(ValidationUtilities.isEntityValid(testEntityWithoutData, 'create')).toBe(false);
        expect(ValidationUtilities.isEntityValid(testEntityWithoutData, 'update')).toBe(false);
    });
    test('Optional value should not invalidate when set to undefined', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.optionalValue = undefined;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
        tE.optionalValue = 'optional';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('empty string should invalidate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxLengthStringValue = '';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthStringValue = '1234';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // BOOLEAN
    test('BOOLEAN_CHECKBOX BOOLEAN_TOGGLE required', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.booleanCheckboxValue = false;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.booleanCheckboxValue = true;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.booleanToggleValue = false;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.booleanToggleValue = true;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING
    test('STRING maxLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxLengthStringValue = '12345';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthStringValue = 'ABCD';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING minLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.minLengthStringValue = '123';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthStringValue = 'ABCDEFG';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING regex', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.regexStringValue = '12345s';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.regexStringValue = '54321';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING_AUTOCOMPLETE
    test('STRING_AUTOCOMPLETE maxLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxLengthAutocompleteStringValue = '12345';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthAutocompleteStringValue = 'ABCD';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE minLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.minLengthAutocompleteStringValue = '123';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthAutocompleteStringValue = 'ABCDEFG';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE regex', () => {
        testEntity.regexAutocompleteStringValue = '12345s';
        expect(ValidationUtilities.isEntityValid(testEntity, 'create')).toBe(false);
        testEntity.regexAutocompleteStringValue = '54321';
        expect(ValidationUtilities.isEntityValid(testEntity, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE restrictToValues', () => {
        const currentMetadata: PropertyDecoratorConfigInternal<unknown> = ReflectUtilities.getMetadata('metadata', testEntity, 'regexAutocompleteStringValue') as PropertyDecoratorConfigInternal<unknown>;
        ReflectUtilities.defineMetadata('metadata', { ...currentMetadata, restrictToOptions: true }, testEntity, 'regexAutocompleteStringValue');

        testEntity.regexAutocompleteStringValue = '54321';
        expect(ValidationUtilities.isEntityValid(testEntity, 'create')).toBe(false);
        testEntity.regexAutocompleteStringValue = '1234';
        expect(ValidationUtilities.isEntityValid(testEntity, 'create')).toBe(true);

        ReflectUtilities.defineMetadata('metadata', { ...currentMetadata, restrictToOptions: false }, testEntity, 'regexAutocompleteStringValue');
    });

    // STRING_TEXTBOX
    test('STRING_TEXTBOX maxLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxLengthTextboxStringValue = '12345';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthTextboxStringValue = 'ABCD';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_TEXTBOX minLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.minLengthTextboxStringValue = '123';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthTextboxStringValue = 'ABCDEFG';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING_PASSWORD
    test('STRING_PASSWORD maxLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.passwordString = '1234567891011';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.passwordString = '12345678';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_PASSWORD minLength', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.passwordString = '1234567';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.passwordString = '12345678';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_PASSWORD regex', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.passwordString = 'ABCDEFGH';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.passwordString = 'ABCDEFGH1';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_PASSWORD not confirmed', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString + 's', tE, 'passwordString');
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // NUMBER
    test('NUMBER max', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxNumberValue = 11;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxNumberValue = 10;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('NUMBER min', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.minNumberValue = 9;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minNumberValue = 10;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // OBJECT
    test('OBJECT', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.objectValue.maxLengthStringValue = '12345';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.objectValue.maxLengthStringValue = '1234';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // ARRAY
    test('ARRAY', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.stringChipsArrayValue = [];
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.stringChipsArrayValue = ['1234'];
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // DATE
    test('DATE max', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateValue.setFullYear(2023);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateValue.setFullYear(2022);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE min', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateValue.setFullYear(2021);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateValue.setFullYear(2022);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE filter', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateValue.setDate(1);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateValue.setDate(2);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // DATE_RANGE
    test('DATE_RANGE undefined', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.start = undefined as unknown as Date;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start = new Date(testEntity.customDateRangeValue.start);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.customDateRangeValue.end = undefined as unknown as Date;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end = new Date(testEntity.customDateRangeValue.end);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE maxStart', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.start.setFullYear(2023);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start.setFullYear(2022);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE minStart', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.start.setFullYear(2021);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start.setFullYear(2022);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE maxEnd', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.end.setFullYear(2023);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end.setFullYear(2022);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE minEnd', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.end.setFullYear(2021);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end.setFullYear(2022);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_RANGE filter', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        (tE.customDateRangeValue.start).setDate(1);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.start.setDate(2);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.customDateRangeValue.end.setDate(1);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.end.setDate(2);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.customDateRangeValue.values = [new Date(2022, 0, 1)];
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateRangeValue.values = getDatesBetween(new Date(tE.customDateRangeValue.start), new Date(tE.customDateRangeValue.end));
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // DATE_TIME
    test('DATE_TIME no time', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        ReflectUtilities.defineMetadata(EntityUtilities.TIME_KEY, undefined, tE, 'customDateTimeValue');
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME maxDate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setFullYear(2023);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setFullYear(2022);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME minDate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setFullYear(2021);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setFullYear(2022);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME filterDate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setDate(1);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setDate(2);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME maxHours', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setHours(17);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME minHours', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setHours(7);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);

        tE.customDateTimeValue.setHours(8);
        tE.customDateTimeValue.setMinutes(0);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        tE.customDateTimeValue.setMinutes(30);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('DATE_TIME filter', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setHours(12);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // FILE
    test('FILE missing name', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.fileValue.name = undefined as unknown as string;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.fileValue.name = '6qW2XkuI_400x400.png';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('FILE missing file and url', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.fileValue.file = undefined;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
        tE.fileValue.url = undefined;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);

        tE.fileValue.file = testEntity.fileValue.file;
        tE.fileValue.url = testEntity.fileValue.url;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('FILE mimetype invalid', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.imageValue.type = 'application/pdf';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.imageValue.type = 'image/jpg';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('FILE single size invalid', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.fileValue.size = 10000001;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.fileValue.size = 10000000;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('FILE multi size invalid', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        for (let i: number = 0; i < 10; i++) {
            tE.customImageValues.push(
                {
                    url: 'http://localhost:3000/file/',
                    name: '6qW2XkuI_400x400.png',
                    type: 'image/jpg',
                    size: 10000000
                }
            );
        }
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.customImageValues = testEntity.customImageValues;
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // REFERENCES_MANY
    // test('REFERENCES_MANY single size invalid', () => {
    //     const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
    //     expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    // });

    // CUSTOM
    test('CUSTOM isValid', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.randomValue = '123456';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.randomValue = '42';
        expect(ValidationUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // unknown metadata type
    test('should throw error for unknown metadata type', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        ReflectUtilities.defineMetadata('type', 'invalid type', tE, 'maxLengthStringValue');
        const EXPECTED_EM: string = 'Could not validate the input because the DecoratorType invalid type is not known';
        expect(() => ValidationUtilities.isEntityValid(tE, 'create')).toThrow(EXPECTED_EM);
    });
});