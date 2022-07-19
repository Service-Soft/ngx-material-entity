import { Entity } from '../classes/entity-model.class';
import { EntityUtilities } from '../classes/entity-utilities.class';
import { string } from '../decorators/string/string.decorator';
import { number } from '../decorators/number/number.decorator';
import { object } from '../decorators/object/object.decorator';
import { array } from '../decorators/array/array.decorator';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { boolean } from '../decorators/boolean/boolean.decorator';

/**
 * An Entity used to Test the @object decorator on the TestEntity class.
 */
export class TestObjectEntity extends Entity {
    @string({
        displayStyle: 'line',
        displayName: 'Object Max Length Value',
        maxLength: 4
    })
    maxLengthStringValue!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Object Row Value 1',
        position: {
            row: 1
        }
    })
    rowValue1!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Object Row Value 2',
        position: {
            row: 2
        }
    })
    rowValue2!: string;

    constructor(entity?: TestObjectEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

/**
 * An Entity used to Test the @array decorator with itemType OBJECT.
 */
export class TestObjectArrayEntity extends Entity {
    @string({
        displayStyle: 'line',
        displayName: 'Array Object Value'
    })
    stringValue!: string;

    constructor(entity?: TestObjectArrayEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

/**
 * The Entity used for most Tests. It has values for almost all combination of decorator metadata
 * and can be easily instantiated with the TestEntityMockBuilder.
 */
export class TestEntity extends Entity {

    @string({
        displayStyle: 'line',
        displayName: 'Order Value 3',
        position: {
            order: 3
        }
    })
    orderValue3!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Omit for Create Value',
        omitForCreate: true
    })
    omitForCreateValue!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Omit for Update Value',
        omitForUpdate: true
    })
    omitForUpdateValue!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Order Value 2',
        position: {
            order: 2
        }
    })
    orderValue2!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Order Value 1',
        position: {
            order: 1
        }
    })
    orderValue1!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Optional Value',
        required: false
    })
    optionalValue?: string;

    @string({
        displayStyle: 'line',
        displayName: 'Row Value',
        required: true,
        position: {
            row: 1
        }
    })
    rowValue!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Max Length Value',
        maxLength: 4
    })
    maxLengthStringValue!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Min Length Value',
        minLength: 4
    })
    minLengthStringValue!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Regex Value',
        regex: new RegExp('^[0-9]+$')
    })
    regexStringValue!: string;

    @string({
        displayStyle: 'autocomplete',
        displayName: 'Max Length Autocomplete Value',
        autocompleteValues: ['Test', '123'],
        maxLength: 4
    })
    maxLengthAutocompleteStringValue!: string;

    @string({
        displayStyle: 'autocomplete',
        displayName: 'Min Length Autocomplete Value',
        autocompleteValues: ['Tests', '12345'],
        minLength: 4
    })
    minLengthAutocompleteStringValue!: string;

    @string({
        displayStyle: 'autocomplete',
        displayName: 'Regex Autocomplete Value',
        autocompleteValues: ['1234', '5678'],
        regex: new RegExp('^[0-9]+$')
    })
    regexAutocompleteStringValue!: string;

    @string({
        displayStyle: 'textbox',
        displayName: 'Max Length Textbox Value',
        maxLength: 4
    })
    maxLengthTextboxStringValue!: string;

    @string({
        displayStyle: 'textbox',
        displayName: 'Min Length Textbox Value',
        minLength: 4
    })
    minLengthTextboxStringValue!: string;

    @number({
        displayStyle: 'line',
        displayName: 'Min Number Value',
        min: 10
    })
    minNumberValue!: number;

    @number({
        displayStyle: 'line',
        displayName: 'Max Number Value',
        max: 10
    })
    maxNumberValue!: number;

    @object({
        displayStyle: 'inline',
        displayName: 'Object Value',
        type: TestObjectEntity
    })
    objectValue!: TestObjectEntity;

    @array({
        displayStyle: 'chips',
        displayName: 'String Chips Array Value',
        itemType: DecoratorTypes.STRING
    })
    stringChipsArrayValue!: string[];

    @array({
        displayStyle: 'chips',
        displayName: 'String Chips Array Value With Config',
        itemType: DecoratorTypes.STRING,
        deleteIcon: 'fas fa-trash',
        defaultWidths: [12, 12, 12]
    })
    stringChipsArrayValueWithConfig!: string[];

    @array({
        displayStyle: 'chips',
        displayName: 'String Chips Autocomplete Array Value',
        itemType: DecoratorTypes.STRING_AUTOCOMPLETE,
        autocompleteValues: ['ABCDE', 'FGHIJ']
    })
    stringChipsAutocompleteArrayValue!: string[];

    @array({
        displayStyle: 'chips',
        displayName: 'String Chips Autocomplete Array Value With Config',
        itemType: DecoratorTypes.STRING_AUTOCOMPLETE,
        autocompleteValues: ['ABCDE', 'FGHIJ'],
        deleteIcon: 'fas fa-trash',
        defaultWidths: [6, 6, 6]
    })
    stringChipsAutocompleteArrayValueWithConfig!: string[];

    @array({
        displayName: 'Entity Array',
        itemType: DecoratorTypes.OBJECT,
        displayStyle: 'table',
        EntityClass: TestObjectArrayEntity,
        displayColumns: [
            {
                displayName: 'Id',
                value: (entity: TestObjectArrayEntity) => entity.id
            },
            {
                displayName: 'String Value',
                value: (entity: TestObjectArrayEntity) => entity.stringValue
            }
        ],
    })
    entityArrayValue!: TestObjectArrayEntity[];

    @array({
        displayName: 'Entity Array With Config',
        itemType: DecoratorTypes.OBJECT,
        displayStyle: 'table',
        EntityClass: TestObjectArrayEntity,
        displayColumns: [
            {
                displayName: 'Id',
                value: (entity: TestObjectArrayEntity) => entity.id
            },
            {
                displayName: 'String Value',
                value: (entity: TestObjectArrayEntity) => entity.stringValue
            }
        ],
        missingErrorMessage: 'custom missing error message',
        createInline: false,
        addButtonLabel: 'Custom Add',
        removeButtonLabel: 'Custom Remove',
        defaultWidths: [6, 6, 6]
    })
    entityArrayValueWithConfig!: TestObjectArrayEntity[];

    @number({
        displayName: 'Number Dropdown Value',
        displayStyle: 'dropdown',
        dropdownValues: [
            {
                displayName: '42',
                value: 42
            },
            {
                displayName: '1',
                value: 1
            }
        ]
    })
    numberDropdownValue!: number;

    @string({
        displayName: 'String Dropdown Value',
        displayStyle: 'dropdown',
        dropdownValues: [
            {
                displayName: 'String Dropdown #1',
                value: 'String Dropdown #1'
            },
            {
                displayName: 'String Dropdown #2',
                value: 'String Dropdown #2'
            }
        ]
    })
    stringDropdownValue!: string;

    @boolean({
        displayName: 'Boolean Dropdown Value',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    booleanDropdownValue!: boolean;

    @boolean({
        displayName: 'Boolean Checkbox Value',
        displayStyle: 'checkbox'
    })
    booleanCheckboxValue!: boolean;

    @boolean({
        displayName: 'Boolean Toggle Value',
        displayStyle: 'toggle'
    })
    booleanToggleValue!: boolean;

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
    stringChipsAutocompleteArrayValue: ['ABCDE', 'FGHIJ'],
    stringChipsArrayValueWithConfig: ['01234', '56789'],
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
    numberDropdownValue: 42,
    stringDropdownValue: 'String Dropdown #1',
    booleanDropdownValue: true,
    booleanCheckboxValue: true,
    booleanToggleValue: true
}

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