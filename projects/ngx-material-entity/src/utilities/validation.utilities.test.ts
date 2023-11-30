import { expect } from '@jest/globals';
import { PropertyDecoratorConfigInternal } from '../decorators/base/property-decorator-internal.data';
import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../encapsulation/reflect.utilities';
import { mockInjector } from '../mocks/environment-injector.mock';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder, getDatesBetween } from '../mocks/test-entity.interface';
import { EntityUtilities } from './entity.utilities';
import { ValidationError, ValidationUtilities } from './validation.utilities';

const builder: TestEntityWithoutCustomPropertiesMockBuilder = new TestEntityWithoutCustomPropertiesMockBuilder();
const testEntity: TestEntityWithoutCustomProperties = builder.testEntity;
const testEntityWithoutData: TestEntityWithoutCustomProperties = builder.testEntityWithoutData;

describe('isEntityValid', () => {
    test('testEntity should be valid for create and update', async () => {
        expect(await ValidationUtilities.isEntityValid(testEntity, mockInjector, 'create')).toBe(true);
        expect(await ValidationUtilities.isEntityValid(testEntity, mockInjector, 'update')).toBe(true);
    });
    test('testEntityWithoutData should be invalid for create and update', async () => {
        expect(await ValidationUtilities.isEntityValid(testEntityWithoutData, mockInjector, 'create')).toBe(false);
        expect(await ValidationUtilities.isEntityValid(testEntityWithoutData, mockInjector, 'update')).toBe(false);
    });
    test('Optional value should not invalidate when set to undefined', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.optionalValue = undefined;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
        tE.optionalValue = 'optional';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('empty string should invalidate', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxLengthStringValue = '';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.maxLengthStringValue = '1234';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // BOOLEAN
    test('BOOLEAN_CHECKBOX BOOLEAN_TOGGLE required', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.booleanCheckboxValue = false;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.booleanCheckboxValue = true;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);

        tE.booleanToggleValue = false;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.booleanToggleValue = true;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // STRING
    test('STRING maxLength', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxLengthStringValue = '12345';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.maxLengthStringValue = 'ABCD';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('STRING minLength', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.minLengthStringValue = '123';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.minLengthStringValue = 'ABCDEFG';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('STRING regex', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.regexStringValue = '12345s';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.regexStringValue = '54321';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // STRING_AUTOCOMPLETE
    test('STRING_AUTOCOMPLETE maxLength', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxLengthAutocompleteStringValue = '12345';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.maxLengthAutocompleteStringValue = 'ABCD';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE minLength', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.minLengthAutocompleteStringValue = '123';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.minLengthAutocompleteStringValue = 'ABCDEFG';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE regex', async () => {
        testEntity.regexAutocompleteStringValue = '12345s';
        expect(await ValidationUtilities.isEntityValid(testEntity, mockInjector, 'create')).toBe(false);
        testEntity.regexAutocompleteStringValue = '54321';
        expect(await ValidationUtilities.isEntityValid(testEntity, mockInjector, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE restrictToValues', async () => {
        const currentMetadata: PropertyDecoratorConfigInternal<unknown> = ReflectUtilities.getMetadata('metadata', testEntity, 'regexAutocompleteStringValue') as PropertyDecoratorConfigInternal<unknown>;
        ReflectUtilities.defineMetadata('metadata', { ...currentMetadata, restrictToOptions: true }, testEntity, 'regexAutocompleteStringValue');

        testEntity.regexAutocompleteStringValue = '54321';
        expect(await ValidationUtilities.isEntityValid(testEntity, mockInjector, 'create')).toBe(false);
        testEntity.regexAutocompleteStringValue = '1234';
        expect(await ValidationUtilities.isEntityValid(testEntity, mockInjector, 'create')).toBe(true);

        ReflectUtilities.defineMetadata('metadata', { ...currentMetadata, restrictToOptions: false }, testEntity, 'regexAutocompleteStringValue');
    });

    // STRING_TEXTBOX
    test('STRING_TEXTBOX maxLength', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxLengthTextboxStringValue = '12345';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.maxLengthTextboxStringValue = 'ABCD';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('STRING_TEXTBOX minLength', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.minLengthTextboxStringValue = '123';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.minLengthTextboxStringValue = 'ABCDEFG';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // STRING_PASSWORD
    test('STRING_PASSWORD maxLength', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.passwordString = '1234567891011';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.passwordString = '12345678';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('STRING_PASSWORD minLength', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.passwordString = '1234567';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.passwordString = '12345678';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('STRING_PASSWORD regex', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.passwordString = 'ABCDEFGH';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.passwordString = 'ABCDEFGH1';
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('STRING_PASSWORD not confirmed', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        ReflectUtilities.defineMetadata('confirmPassword', tE.passwordString + 's', tE, 'passwordString');
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // NUMBER
    test('NUMBER max', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.maxNumberValue = 11;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.maxNumberValue = 10;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('NUMBER min', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.minNumberValue = 9;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.minNumberValue = 10;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // OBJECT
    test('OBJECT', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.objectValue.maxLengthStringValue = '12345';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.objectValue.maxLengthStringValue = '1234';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // ARRAY
    test('ARRAY_STRING required', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.stringChipsArrayValue = [];
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.stringChipsArrayValue = ['1234'];
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('ARRAY_STRING_AUTOCOMPLETE restrictToOptions', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.stringChipsAutocompleteArrayValueWithConfig = ['INVALID_VALUE'];
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.stringChipsAutocompleteArrayValueWithConfig = ['ABCDE'];
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('ARRAY_STRING_AUTOCOMPLETE required', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.stringChipsAutocompleteArrayValue = [];
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.stringChipsAutocompleteArrayValue = ['1234'];
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // DATE
    test('DATE max', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateValue.setFullYear(2023);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateValue.setFullYear(2022);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE min', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateValue.setFullYear(2021);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateValue.setFullYear(2022);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE filter', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateValue.setDate(1);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateValue.setDate(2);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // DATE_RANGE
    test('DATE_RANGE undefined', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.start = undefined as unknown as Date;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateRangeValue.start = new Date(testEntity.customDateRangeValue.start);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);

        tE.customDateRangeValue.end = undefined as unknown as Date;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateRangeValue.end = new Date(testEntity.customDateRangeValue.end);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_RANGE maxStart', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.start.setFullYear(2023);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateRangeValue.start.setFullYear(2022);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_RANGE minStart', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.start.setFullYear(2021);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateRangeValue.start.setFullYear(2022);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_RANGE maxEnd', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.end.setFullYear(2023);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateRangeValue.end.setFullYear(2022);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_RANGE minEnd', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateRangeValue.end.setFullYear(2021);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateRangeValue.end.setFullYear(2022);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_RANGE filter', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        (tE.customDateRangeValue.start).setDate(1);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateRangeValue.start.setDate(2);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);

        tE.customDateRangeValue.end.setDate(1);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateRangeValue.end.setDate(2);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);

        tE.customDateRangeValue.values = [new Date(2022, 0, 1)];
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateRangeValue.values = getDatesBetween(new Date(tE.customDateRangeValue.start), new Date(tE.customDateRangeValue.end));
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // DATE_TIME
    test('DATE_TIME no time', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        ReflectUtilities.defineMetadata(EntityUtilities.TIME_KEY, undefined, tE, 'customDateTimeValue');
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_TIME maxDate', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setFullYear(2023);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateTimeValue.setFullYear(2022);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_TIME minDate', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setFullYear(2021);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateTimeValue.setFullYear(2022);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_TIME filterDate', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setDate(1);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateTimeValue.setDate(2);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_TIME maxHours', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setHours(17);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_TIME minHours', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setHours(7);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);

        tE.customDateTimeValue.setHours(8);
        tE.customDateTimeValue.setMinutes(0);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        tE.customDateTimeValue.setMinutes(30);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('DATE_TIME filter', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.customDateTimeValue.setHours(12);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customDateTimeValue.setHours(16);
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // FILE
    test('FILE missing name', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.fileValue.name = undefined as unknown as string;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.fileValue.name = '6qW2XkuI_400x400.png';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('FILE missing file and url', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.fileValue.file = undefined;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
        tE.fileValue.url = undefined;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);

        tE.fileValue.file = testEntity.fileValue.file;
        tE.fileValue.url = testEntity.fileValue.url;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('FILE mimetype invalid', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.imageValue.type = 'application/pdf';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.imageValue.type = 'image/jpg';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('FILE single size invalid', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.fileValue.size = 10000001;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.fileValue.size = 10000000;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });
    test('FILE multi size invalid', async () => {
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
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.customImageValues = testEntity.customImageValues;
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // REFERENCES_MANY
    // test('REFERENCES_MANY single size invalid', () => {
    //     const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
    //     expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    // });

    // CUSTOM
    test('CUSTOM isValid', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        tE.randomValue = '123456';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(false);
        tE.randomValue = '42';
        expect(await ValidationUtilities.isEntityValid(tE, mockInjector, 'create')).toBe(true);
    });

    // unknown metadata type
    test('should throw error for unknown metadata type', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        ReflectUtilities.defineMetadata('type', 'invalid type', tE, 'maxLengthStringValue');
        const EXPECTED_EM: string = 'Could not validate the input because the DecoratorType invalid type is not known';
        let thrownErrorMessage: string = '';
        try {
            await ValidationUtilities.isEntityValid(tE, mockInjector, 'create');
        }
        catch (error) {
            // eslint-disable-next-line typescript/no-unsafe-assignment, typescript/no-unsafe-member-access, typescript/no-explicit-any
            thrownErrorMessage = (error as any).message;
        }
        expect(thrownErrorMessage).toEqual(EXPECTED_EM);
    });
});

describe('getPropertyValidationError', () => {
    test('should return undefined for properties that are not decorated', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const validationError: ValidationError | undefined = await ValidationUtilities.getPropertyValidationError(tE, 'notDecoratedValue');
        expect(validationError).toBe(undefined);
    });
});