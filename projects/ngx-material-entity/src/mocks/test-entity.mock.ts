/* eslint-disable jsdoc/require-jsdoc */
import { EntityUtilities } from '../classes/entity.utilities';
import { custom } from '../decorators/custom/custom.decorator';
import { TestRandomInputComponent } from '../../../ngx-material-entity-showcase/src/app/components/custom-input-component/custom-input.component';
import { getDatesBetween, TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesInterface } from './test-entity.interface';

export interface TestEntityInterface extends TestEntityWithoutCustomPropertiesInterface {
    randomValue: string
}

export interface RandomMetadata {
    random: () => string
}

/**
 * The Entity used for most Tests. It has values for almost all combination of decorator metadata
 * and can be easily instantiated with the TestEntityMockBuilder.
 */
export class TestEntity extends TestEntityWithoutCustomProperties implements TestEntityInterface {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    @custom<string, RandomMetadata, TestEntity>({
        customMetadata: {
            random: () => (Math.random() + 1).toString(36).substring(7)
        },
        displayName: 'Random Value',
        // this conversion is not needed under real life conditions
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        component: TestRandomInputComponent as any
    })
    declare randomValue: string;

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

/**
 * Base data used for the TestEntityMockBuilder if no custom data was provided.
 */
const testEntityData: TestEntity = {
    id: '1',
    omitForCreateValue: 'omitForCreateValue',
    omitForUpdateValue: 'omitForUpdateValue',
    optionalValue: 'optional',
    maxLengthStringValue: '1234',
    minLengthStringValue: '12345678',
    regexStringValue: '12345',
    maxLengthAutocompleteStringValue: '1234',
    minLengthAutocompleteStringValue: '12345678',
    regexAutocompleteStringValue: '12345',
    maxLengthTextboxStringValue: '1234',
    minLengthTextboxStringValue: '12345678',
    minNumberValue: 42,
    maxNumberValue: 5,
    objectValue: {
        id: '1',
        maxLengthStringValue: '1234',
        rowValue1: 'rowValue1',
        rowValue2: 'rowValue2'
    },
    stringChipsArrayValue: ['01234', '56789'],
    // eslint-disable-next-line @cspell/spellchecker
    stringChipsAutocompleteArrayValue: ['ABCDE', 'FGHIJ'],
    stringChipsArrayValueWithConfig: ['01234', '56789'],
    // eslint-disable-next-line @cspell/spellchecker
    stringChipsAutocompleteArrayValueWithConfig: ['ABCDE', 'FGHIJ'],
    orderValue1: '1',
    orderValue2: '2',
    orderValue3: '3',
    rowValue: 'row1',
    entityArrayValue: [
        {
            id: '1',
            stringValue: 'stringValue'
        },
        {
            id: '2',
            stringValue: 'stringValue2'
        }
    ],
    entityArrayValueWithConfig: [
        {
            id: '1',
            stringValue: 'stringValue'
        },
        {
            id: '2',
            stringValue: 'stringValue2'
        }
    ],
    dateArrayValue: [
        new Date(2022, 0, 1),
        new Date(2022, 0, 20),
    ],
    customDateArrayValue: [
        new Date(2022, 0, 2),
        new Date(2022, 0, 20),
    ],
    dateTimeArrayValue: [
        new Date(2022, 0, 1, 0, 30),
        new Date(2022, 0, 20, 16, 0),
    ],
    customDateTimeArrayValue: [
        new Date(2022, 0, 2, 8, 30),
        new Date(2022, 0, 20, 16, 0),
    ],
    dateRangeArrayValue: [
        {
            start: new Date(2022, 0, 1, 0, 0, 0, 0),
            end: new Date(2022, 0, 20, 0, 0, 0, 0),
            values: getDatesBetween(new Date(2022, 0, 1, 0, 0, 0, 0), new Date(2022, 0, 20, 0, 0, 0, 0))
        },
        {
            start: new Date(2022, 0, 25, 0, 0, 0, 0),
            end: new Date(2022, 0, 30, 0, 0, 0, 0),
            values: getDatesBetween(new Date(2022, 0, 25, 0, 0, 0, 0), new Date(2022, 0, 30, 0, 0, 0, 0))
        },
    ],
    customDateRangeArrayValue: [
        {
            start: new Date(2022, 0, 2, 0, 0, 0, 0),
            end: new Date(2022, 0, 20, 0, 0, 0, 0),
            values: getDatesBetween(new Date(2022, 0, 2, 0, 0, 0, 0), new Date(2022, 0, 20, 0, 0, 0, 0))
        },
        {
            start: new Date(2022, 0, 25, 0, 0, 0, 0),
            end: new Date(2022, 0, 30, 0, 0, 0, 0),
            values: getDatesBetween(new Date(2022, 0, 25, 0, 0, 0, 0), new Date(2022, 0, 30, 0, 0, 0, 0))
        },
    ],
    numberDropdownValue: 42,
    stringDropdownValue: 'String Dropdown #1',
    booleanDropdownValue: true,
    booleanCheckboxValue: true,
    booleanToggleValue: true,
    dateValue: new Date(),
    customDateValue: new Date(2022, 0, 2, 0, 0, 0, 0),
    dateRangeValue: {
        start: new Date(2022, 0, 1, 0, 0, 0, 0),
        end: new Date(2022, 0, 20, 0, 0, 0, 0)
    },
    customDateRangeValue: {
        start: new Date(2022, 0, 2, 0, 0, 0, 0),
        end: new Date(2022, 0, 20, 0, 0, 0, 0),
        // eslint-disable-next-line max-len
        values: getDatesBetween(new Date(2022, 0, 2, 0, 0, 0, 0), new Date(2022, 0, 20, 0, 0, 0, 0), (date: Date | null | undefined) => new Date(date as Date).getDate() !== 1,)
    },
    dateTimeValue: new Date(2022, 0, 1, 8, 30, 0, 0),
    customDateTimeValue: new Date(2022, 0, 2, 16, 30, 0, 0),
    fileValue: {
        name: '6qW2XkuI_400x400.png',
        url: 'http://localhost:3000/file/',
        size: 4429,
        type: 'image/jpg'
    },
    dragDropFileValue: {
        name: '6qW2XkuI_400x400.png',
        url: 'http://localhost:3000/file/',
        size: 4429,
        type: 'image/jpg'
    },
    customFileValues: [
        {
            url: 'http://localhost:3000/file/',
            name: '6qW2XkuI_400x400.png',
            size: 4429,
            type: 'image/jpg'
        },
        {
            url: 'http://localhost:3000/file/',
            name: 'test-2.png',
            size: 4429,
            type: 'image/jpg'
        }
    ],
    imageValue: {
        url: 'http://localhost:3000/file/',
        name: 'image-value.png',
        size: 4429,
        type: 'image/jpg'
    },
    imageDragDropValue: {
        url: 'http://localhost:3000/file/',
        name: 'image-value.png',
        size: 4429,
        type: 'image/jpg'
    },
    customImageValues: [
        {
            url: 'http://localhost:3000/file/',
            name: '6qW2XkuI_400x400.png',
            size: 4429,
            type: 'image/jpg'
        },
        {
            url: 'http://localhost:3000/file/',
            name: 'test-2.png',
            size: 4429,
            type: 'image/jpg'
        }
    ],
    randomValue: '42'
};

/**
 * A builder used to generate TestEntity Mocks.
 */
export class TestEntityMockBuilder {
    /**
     * The testEntity with the given Data or the default data
     * specified in "testEntityData".
     */
    testEntity: TestEntity;
    /**
     * The TestEntity with empty values.
     */
    testEntityWithoutData: TestEntity;
    /**
     * The data that was input when new has been called.
     */
    testEntityData: TestEntity;

    constructor(data: TestEntity = testEntityData) {
        this.testEntityData = data;
        this.testEntity = new TestEntity(data);
        this.testEntityWithoutData = new TestEntity();
    }
}