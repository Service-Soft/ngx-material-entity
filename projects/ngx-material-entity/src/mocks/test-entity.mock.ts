import { Entity } from '../classes/entity-model.class';
import { EntityUtilities } from '../classes/entity-utilities.class';
import { string } from '../decorators/string/string.decorator';
import { number } from '../decorators/number/number.decorator';
import { object } from '../decorators/object/object.decorator';
import { array } from '../decorators/array/array.decorator';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';

export class TestObjectEntity extends Entity {
    @string({
        displayStyle: 'line',
        displayName: 'Object Max Length Value',
        maxLength: 4
    })
    maxLengthStringValue!: string;

    constructor(entity?: TestObjectEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

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

export class TestEntity extends Entity {

    @string({
        displayStyle: 'line',
        displayName: 'Order Value 3',
        order: 3
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
        order: 2
    })
    orderValue2!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Order Value 1',
        order: 1
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
        displayName: 'String Chips Autocomplete Array Value',
        itemType: DecoratorTypes.STRING_AUTOCOMPLETE,
        autocompleteValues: ['ABCDE', 'FGHIJ']
    })
    stringChipsAutocompleteArrayValue!: string[];

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

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

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
        maxLengthStringValue: '1234'
    },
    stringChipsArrayValue: ['01234', '56789'],
    stringChipsAutocompleteArrayValue: ['ABCDE', 'FGHIJ'],
    orderValue1: '1',
    orderValue2: '2',
    orderValue3: '3',
    entityArrayValue: [
        {
            id: '1',
            stringValue: 'stringValue'
        }
    ]
}

export class TestEntityMockBuilder {
    testEntity: TestEntity;
    testEntityWithoutData: TestEntity;
    testEntityData: TestEntity;

    constructor(data: TestEntity = testEntityData) {
        this.testEntityData = data;
        this.testEntity = new TestEntity(data);
        this.testEntityWithoutData = new TestEntity();
    }
}