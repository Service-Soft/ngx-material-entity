/* eslint-disable jsdoc/require-jsdoc */
import { DateFilterFn } from '@angular/material/datepicker';
import { firstValueFrom, of } from 'rxjs';
import { Entity } from '../classes/entity.model';
import { array } from '../decorators/array/array.decorator';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { DropdownValue } from '../decorators/base/dropdown-value.interface';
import { boolean } from '../decorators/boolean/boolean.decorator';
import { custom } from '../decorators/custom/custom.decorator';
import { DateRange } from '../decorators/date/date-decorator.data';
import { date } from '../decorators/date/date.decorator';
import { FileData } from '../decorators/file/file-decorator.data';
import { file } from '../decorators/file/file.decorator';
import { number } from '../decorators/number/number.decorator';
import { object } from '../decorators/object/object.decorator';
import { referencesMany } from '../decorators/references-many/references-many.decorator';
import { string } from '../decorators/string/string.decorator';
import { ReflectUtilities } from '../encapsulation/reflect.utilities';
import { DateUtilities } from '../utilities/date.utilities';
import { EntityUtilities } from '../utilities/entity.utilities';
import { FileUtilities } from '../utilities/file.utilities';
import { RandomMetadata } from './test-entity.mock';

/**
 * An Entity used to Test the @object decorator on the TestEntity class.
 */
export class TestObjectEntity extends Entity {
    @string({
        displayStyle: 'line',
        displayName: 'Object Max Length Value',
        maxLength: 4,
        position: {
            tabName: 'Object First Tab Values'
        }
    })
    maxLengthStringValue!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Object Second Tab Value',
        position: {
            tab: 2,
            tabName: 'Other properties'
        }
    })
    secondTabStringValue!: string;

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

    @string({
        displayStyle: 'line',
        displayName: 'Second Tab Value',
        position: {
            tab: 2
        }
    })
    secondTabValue!: string;

    constructor(entity?: TestObjectArrayEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

export class ReferencedEntity extends Entity {
    @string({
        displayStyle: 'line',
        displayName: 'Example Value'
    })
    stringValue!: string;

    constructor(entity?: ReferencedEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

export interface TestEntityWithoutCustomPropertiesInterface {
    id: string,
    secondTabValue: string,
    omitForCreateValue: string,
    omitForUpdateValue: string,
    optionalValue?: string,
    maxLengthStringValue: string,
    minLengthStringValue: string,
    regexStringValue: string,
    maxLengthAutocompleteStringValue: string,
    minLengthAutocompleteStringValue: string,
    regexAutocompleteStringValue: string,
    maxLengthTextboxStringValue: string,
    minLengthTextboxStringValue: string,
    passwordString: string,
    minNumberValue: number,
    maxNumberValue: number,
    numberSliderValue: number,
    objectValue: {
        id: string,
        maxLengthStringValue: string,
        secondTabStringValue: string,
        rowValue1: string,
        rowValue2: string
    },
    stringChipsArrayValue: string[],
    stringChipsAutocompleteArrayValue: string[],
    stringChipsArrayValueWithConfig: string[],
    stringChipsAutocompleteArrayValueWithConfig: string[],
    orderValue1: string,
    orderValue2: string,
    orderValue3: string,
    rowValue: string,
    entityArrayValue: {
        id: string,
        stringValue: string,
        secondTabValue: string
    }[],
    entityArrayValueWithConfig: {
        id: string,
        stringValue: string,
        secondTabValue: string
    }[],
    dateArrayValue: Date[],
    customDateArrayValue: Date[],
    dateTimeArrayValue: Date[],
    customDateTimeArrayValue: Date[],
    dateRangeArrayValue: {
        start: Date,
        end: Date,
        values?: Date[]
    }[],
    customDateRangeArrayValue: {
        start: Date,
        end: Date,
        values?: Date[]
    }[],
    numberDropdownValue: number,
    stringDropdownValue: string,
    customBooleanDropdownValue: boolean,
    booleanDropdownValue: boolean,
    booleanCheckboxValue: boolean,
    booleanToggleValue: boolean,
    dateValue: Date,
    customDateValue: Date,
    dateRangeValue: DateRange,
    customDateRangeValue: DateRange,
    dateTimeValue: Date,
    customDateTimeValue: Date,
    fileValue: {
        name: string,
        url?: string,
        size: number,
        type: string
    },
    dragDropFileValue: {
        name: string,
        url?: string,
        size: number,
        type: string
    },
    customFileValues: {
        url?: string,
        name: string,
        size: number,
        type: string
    }[],
    imageValue: {
        url?: string,
        name: string,
        size: number,
        type: string
    },
    imageDragDropValue: {
        url?: string,
        name: string,
        size: number,
        type: string
    },
    customImageValues: {
        url?: string,
        name: string,
        size: number,
        type: string
    }[],
    randomValue: string,
    referencesManyIds: string[]
}

export class TestEntityWithoutCustomProperties extends Entity implements TestEntityWithoutCustomPropertiesInterface {

    @string({
        displayStyle: 'line',
        displayName: 'Second Tab Value',
        position: {
            tab: 2
        }
    })
    secondTabValue!: string;

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

    @string({
        displayStyle: 'password',
        displayName: 'Password Value',
        minLength: 8,
        maxLength: 12,
        regex: /.*[0-9].*/
    })
    passwordString!: string;

    @number({
        displayStyle: 'line',
        displayName: 'Min Number Value',
        min: 10
    })
    minNumberValue!: number;

    @number({
        displayStyle: 'slider',
        displayName: 'Number Slider Value',
        min: 10
    })
    numberSliderValue!: number;

    @number({
        displayStyle: 'line',
        displayName: 'Max Number Value',
        max: 10
    })
    maxNumberValue!: number;

    @object({
        displayStyle: 'inline',
        displayName: 'Object Value',
        EntityClass: TestObjectEntity
    })
    objectValue!: TestObjectEntity;

    @array({
        displayName: 'String Chips Array Value',
        itemType: DecoratorTypes.STRING
    })
    stringChipsArrayValue!: string[];

    @array({
        displayName: 'String Chips Array Value With Config',
        itemType: DecoratorTypes.STRING,
        deleteIcon: 'fas fa-trash',
        defaultWidths: [12, 12, 12],
        allowDuplicates: true
    })
    stringChipsArrayValueWithConfig!: string[];

    @array({
        displayName: 'String Chips Autocomplete Array Value',
        itemType: DecoratorTypes.STRING_AUTOCOMPLETE,
        // eslint-disable-next-line @cspell/spellchecker
        autocompleteValues: ['ABCDE', 'FGHIJ']
    })
    stringChipsAutocompleteArrayValue!: string[];

    @array({
        displayName: 'String Chips Autocomplete Array Value With Config',
        itemType: DecoratorTypes.STRING_AUTOCOMPLETE,
        // eslint-disable-next-line @cspell/spellchecker
        autocompleteValues: ['ABCDE', 'FGHIJ'],
        deleteIcon: 'fas fa-trash',
        defaultWidths: [6, 6, 6],
        allowDuplicates: true
    })
    stringChipsAutocompleteArrayValueWithConfig!: string[];

    @array({
        displayName: 'Entity Array',
        itemType: DecoratorTypes.OBJECT,
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
        ]
    })
    entityArrayValue!: TestObjectArrayEntity[];

    @array({
        displayName: 'Entity Array With Config',
        itemType: DecoratorTypes.OBJECT,
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
        defaultWidths: [6, 6, 6],
        allowDuplicates: true
    })
    entityArrayValueWithConfig!: TestObjectArrayEntity[];

    @array({
        displayName: 'Date Array Value',
        itemType: DecoratorTypes.DATE,
        displayColumns: [
            {
                displayName: 'Date',
                value: (entity) => `${new Date(entity).getDate()}.${new Date(entity).getMonth() + 1}.${new Date(entity).getFullYear()}`
            }
        ],
        duplicatesErrorDialog: {
            type: 'default',
            text: ['Custom Error Text'],
            title: 'Custom Error Title'
        }
    })
    dateArrayValue!: Date[];

    @array({
        displayName: 'Custom Date Array Value',
        itemType: DecoratorTypes.DATE,
        displayColumns: [
            {
                displayName: 'Date',
                value: (entity) => `${new Date(entity).getDate()}.${new Date(entity).getMonth() + 1}.${new Date(entity).getFullYear()}`
            }
        ],
        max: () => new Date(2022, 11, 30, 0, 0, 0, 0),
        min: () => new Date(2022, 0, 1, 0, 0, 0, 0),
        filter: (date: Date | null | undefined) => new Date(date as Date).getDate() !== 1,
        missingErrorMessage: 'custom missing error message',
        addButtonLabel: 'Custom Add',
        removeButtonLabel: 'Custom Remove',
        defaultWidths: [6, 6, 6],
        allowDuplicates: true
    })
    customDateArrayValue!: Date[];

    @array({
        displayName: 'Date Time Array Value',
        itemType: DecoratorTypes.DATE_TIME,
        displayColumns: [
            {
                displayName: 'Date',
                value: (entity) => `${new Date(entity).getHours()}:${new Date(entity).getMinutes()}`
            }
        ]
    })
    dateTimeArrayValue!: Date[];

    @array({
        displayName: 'Custom Date Time Array Value',
        itemType: DecoratorTypes.DATE_TIME,
        displayColumns: [
            {
                displayName: 'Date',
                value: (entity) => `${new Date(entity).getHours()}:${new Date(entity).getMinutes()}`
            }
        ],
        maxDate: () => new Date(2022, 11, 30, 0, 0, 0, 0),
        minDate: () => new Date(2022, 0, 1, 0, 0, 0, 0),
        filterDate: (date: Date | null | undefined) => new Date(date as Date).getDate() !== 1,
        maxTime: () => {
            return {
                hours: 16,
                minutes: 30
            };
        },
        minTime: () => {
            return {
                hours: 8,
                minutes: 30
            };
        },
        filterTime: time => time.hours !== 12,
        timeDisplayName: 'Custom Time Display Name',
        times: DateUtilities.getDefaultTimes(12, 15),
        missingErrorMessage: 'custom missing error message',
        addButtonLabel: 'Custom Add',
        removeButtonLabel: 'Custom Remove',
        defaultWidths: [6, 6, 6],
        allowDuplicates: true
    })
    customDateTimeArrayValue!: Date[];

    @array({
        displayName: 'Date Range Array Value',
        itemType: DecoratorTypes.DATE_RANGE,
        displayColumns: [
            {
                displayName: 'From',
                value: (entity) => new Date(entity.start).toLocaleDateString('de')
            },
            {
                displayName: 'Until',
                value: (entity) => new Date(entity.end).toLocaleDateString('de')
            },
            {
                displayName: 'Days',
                value: (entity) => `${entity.values?.length ?? 0}`
            }
        ]
    })
    dateRangeArrayValue!: DateRange[];

    @array({
        displayName: 'Custom Date Range Array Value',
        itemType: DecoratorTypes.DATE_RANGE,
        displayColumns: [
            {
                displayName: 'From',
                value: (entity) => new Date(entity.start).toLocaleDateString('de')
            },
            {
                displayName: 'Until',
                value: (entity) => new Date(entity.end).toLocaleDateString('de')
            },
            {
                displayName: 'Days',
                value: (entity) => `${entity.values?.length ?? 0}`
            }
        ],
        maxStart: () => new Date(2022, 11, 30, 0, 0, 0, 0),
        minStart: () => new Date(2022, 0, 1, 0, 0, 0, 0),
        maxEnd: () => new Date(2022, 11, 30, 0, 0, 0, 0),
        minEnd: () => new Date(2022, 0, 1, 0, 0, 0, 0),
        filter: (date: Date | null | undefined) => new Date(date as Date).getDate() !== 1,
        missingErrorMessage: 'custom missing error message',
        addButtonLabel: 'Custom Add',
        removeButtonLabel: 'Custom Remove',
        placeholderStart: 'Custom Start',
        placeholderEnd: 'Custom End',
        defaultWidths: [6, 6, 6],
        allowDuplicates: true
    })
    customDateRangeArrayValue!: DateRange[];

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
        displayStyle: 'dropdown'
    })
    booleanDropdownValue!: boolean;

    @boolean({
        displayName: 'Custom Boolean Dropdown Value',
        displayStyle: 'dropdown',
        dropdownTrue: 'True',
        dropdownFalse: 'False'
    })
    customBooleanDropdownValue!: boolean;

    @boolean({
        displayName: 'Boolean Checkbox Value',
        displayStyle: 'checkbox',
        required: true
    })
    booleanCheckboxValue!: boolean;

    @boolean({
        displayName: 'Boolean Toggle Value',
        displayStyle: 'toggle',
        required: true
    })
    booleanToggleValue!: boolean;

    @date({
        displayName: 'Date Value',
        displayStyle: 'date'
    })
    dateValue!: Date;

    @date({
        displayName: 'Custom Date Value',
        displayStyle: 'date',
        max: () => new Date(2022, 11, 30, 0, 0, 0, 0),
        min: () => new Date(2022, 0, 1, 0, 0, 0, 0),
        filter: (date: Date | null | undefined) => new Date(date as Date).getDate() !== 1
    })
    customDateValue!: Date;

    @date({
        displayName: 'Date Range Value',
        displayStyle: 'daterange'
    })
    dateRangeValue!: DateRange;

    @date({
        displayName: 'Custom Date Range Value',
        displayStyle: 'daterange',
        maxStart: () => new Date(2022, 11, 30, 0, 0, 0, 0),
        minStart: () => new Date(2022, 0, 1, 0, 0, 0, 0),
        maxEnd: () => new Date(2022, 11, 30, 0, 0, 0, 0),
        minEnd: () => new Date(2022, 0, 1, 0, 0, 0, 0),
        filter: (date: Date | null | undefined) => new Date(date as Date).getDate() !== 1,
        placeholderStart: 'Custom Start',
        placeholderEnd: 'Custom End'
    })
    customDateRangeValue!: DateRange;

    @date({
        displayName: 'Date Time Value',
        displayStyle: 'datetime'
    })
    dateTimeValue!: Date;

    @date({
        displayName: 'Custom Date Time Value',
        displayStyle: 'datetime',
        maxDate: () => new Date(2022, 11, 30, 0, 0, 0, 0),
        minDate: () => new Date(2022, 0, 1, 0, 0, 0, 0),
        filterDate: (date: Date | null | undefined) => new Date(date as Date).getDate() !== 1,
        maxTime: () => {
            return {
                hours: 16,
                minutes: 30
            };
        },
        minTime: () => {
            return {
                hours: 8,
                minutes: 30
            };
        },
        filterTime: time => time.hours !== 12,
        timeDisplayName: 'Custom Time Display Name',
        times: DateUtilities.getDefaultTimes(12, 15)
    })
    customDateTimeValue!: Date;

    @file({
        type: 'other',
        multiple: false,
        displayName: 'File Value'
    })
    fileValue!: FileData;

    @file({
        type: 'other',
        multiple: false,
        displayName: 'Drag Drop File Value',
        dragAndDrop: true
    })
    dragDropFileValue!: FileData;

    @file({
        type: 'other',
        multiple: true,
        displayName: 'Custom File Values',
        allowedMimeTypes: ['image/*', 'application/pdf', 'application/x-javascript'],
        deleteIcon: 'fas fa-trash',
        maxSize: FileUtilities.transformToMegaBytes(3, 'KB'),
        maxSizeTotal: FileUtilities.transformToMegaBytes(5, 'KB'),
        omitForCreate: true,
        omitForUpdate: true
    })
    customFileValues!: FileData[];

    @file({
        type: 'image',
        multiple: false,
        displayName: 'Image Value',
        preview: false
    })
    imageValue!: FileData;

    @file({
        type: 'image',
        multiple: false,
        displayName: 'Image Drag Drop Value',
        dragAndDrop: true
    })
    imageDragDropValue!: FileData;

    @file({
        type: 'image',
        multiple: true,
        displayName: 'Custom Image Values'
    })
    customImageValues!: FileData[];

    @referencesMany({
        displayName: 'Referenced Entities',
        getReferencedEntities: getReferencedEntities,
        getDropdownValues: getDropdownValues,
        displayColumns: [
            {
                displayName: 'Referenced Entity',
                value: (entity: ReferencedEntity) => `#${entity?.id}: ${entity?.stringValue}`
            }
        ]
    })
    referencesManyIds!: string[];

    @custom<string, RandomMetadata, TestEntityWithoutCustomProperties>({
        customMetadata: {
            random: () => (Math.random() + 1).toString(36).substring(7)
        },
        displayName: 'Random Value',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        component: undefined as any,
        isValid(value) {
            return value.length <= 5;
        }
    })
    randomValue!: string;

    constructor(entity?: TestEntityWithoutCustomProperties) {
        super();
        EntityUtilities.new(this, entity);
    }
}

async function getReferencedEntities(): Promise<ReferencedEntity[]> {
    return firstValueFrom(of([{ id: '1', stringValue: 'String Value' }]));
}

function getDropdownValues(entities: ReferencedEntity[]): DropdownValue<string>[] {
    return entities.map(e => {
        return {
            displayName: `#${e?.id}: ${e?.stringValue}`,
            value: e.id
        };
    });
}

const testEntityData: TestEntityWithoutCustomProperties = {
    id: '1',
    secondTabValue: 'second tab value',
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
    passwordString: '12345678',
    minNumberValue: 42,
    maxNumberValue: 5,
    numberSliderValue: 12,
    objectValue: {
        id: '1',
        maxLengthStringValue: '1234',
        secondTabStringValue: '12345',
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
            stringValue: 'stringValue',
            secondTabValue: 'stv 1'
        },
        {
            id: '2',
            stringValue: 'stringValue2',
            secondTabValue: 'stv 2'
        }
    ],
    entityArrayValueWithConfig: [
        {
            id: '1',
            stringValue: 'stringValue',
            secondTabValue: 'stv 1'
        },
        {
            id: '2',
            stringValue: 'stringValue2',
            secondTabValue: 'stv 2'
        }
    ],
    dateArrayValue: [
        new Date(2022, 0, 1),
        new Date(2022, 0, 20)
    ],
    customDateArrayValue: [
        new Date(2022, 0, 2),
        new Date(2022, 0, 20)
    ],
    dateTimeArrayValue: [
        new Date(2022, 0, 1, 0, 30),
        new Date(2022, 0, 20, 16, 0)
    ],
    customDateTimeArrayValue: [
        new Date(2022, 0, 2, 8, 30),
        new Date(2022, 0, 20, 16, 0)
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
        }
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
        }
    ],
    numberDropdownValue: 42,
    stringDropdownValue: 'String Dropdown #1',
    booleanDropdownValue: true,
    customBooleanDropdownValue: true,
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
        values: getDatesBetween(new Date(2022, 0, 2, 0, 0, 0, 0), new Date(2022, 0, 20, 0, 0, 0, 0), (date: Date | null | undefined) => new Date(date as Date).getDate() !== 1)
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
    referencesManyIds: ['1'],
    randomValue: '42'
};

/**
 * A builder used to generate TestEntity Mocks without custom properties.
 * This is needed because jest would throw an error otherwise.
 */
export class TestEntityWithoutCustomPropertiesMockBuilder {
    /**
     * The testEntity with the given Data or the default data
     * specified in "testEntityData".
     */
    testEntity: TestEntityWithoutCustomProperties;
    /**
     * The TestEntity with empty values.
     */
    testEntityWithoutData: TestEntityWithoutCustomProperties;
    /**
     * The data that was input when new has been called.
     */
    testEntityData: TestEntityWithoutCustomProperties;

    constructor(data: TestEntityWithoutCustomProperties = testEntityData) {
        this.testEntityData = data;
        this.testEntity = new TestEntityWithoutCustomProperties(data);
        this.testEntityWithoutData = new TestEntityWithoutCustomProperties();
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(this.testEntity, this.testEntityWithoutData);
    }

    static setupMetadata(testEntity: TestEntityWithoutCustomProperties, testEntityWithoutData?: TestEntityWithoutCustomProperties): void {
        this.setMetadata(
            EntityUtilities.CONFIRM_PASSWORD_KEY,
            testEntity,
            'passwordString',
            testEntityWithoutData
        );

        this.setMetadata(
            EntityUtilities.TIME_KEY,
            testEntity,
            'dateTimeValue',
            testEntityWithoutData,
            DateUtilities.getTimeFromDate(testEntity.customDateTimeValue)
        );
        this.setMetadata(
            EntityUtilities.TIME_KEY,
            testEntity,
            'customDateTimeValue',
            testEntityWithoutData,
            DateUtilities.getTimeFromDate(testEntity.customDateTimeValue)
        );

        this.setDateRangeMetadata('dateRangeValue', testEntity, testEntityWithoutData);
        this.setDateRangeMetadata('customDateRangeValue', testEntity, testEntityWithoutData);
    }

    private static setMetadata(
        metadataKey: string,
        testEntity: TestEntityWithoutCustomProperties,
        propertyKey: keyof TestEntityWithoutCustomProperties,
        testEntityWithoutData?: TestEntityWithoutCustomProperties,
        value?: unknown
    ): void {
        ReflectUtilities.defineMetadata(metadataKey, value ?? testEntity[propertyKey], testEntity, propertyKey);
        if (testEntityWithoutData != null) {
            ReflectUtilities.defineMetadata(metadataKey, undefined, testEntityWithoutData, propertyKey);
        }
    }

    private static setDateRangeMetadata(
        propertyKey: keyof TestEntityWithoutCustomProperties,
        testEntity: TestEntityWithoutCustomProperties,
        testEntityWithoutData?: TestEntityWithoutCustomProperties
    ): void {
        this.setMetadata(
            EntityUtilities.DATE_RANGE_END_KEY,
            testEntity,
            propertyKey,
            testEntityWithoutData,
            new Date((testEntity[propertyKey] as DateRange).end)
        );
        this.setMetadata(EntityUtilities.DATE_RANGE_KEY, testEntity, propertyKey, testEntityWithoutData);
        this.setMetadata(
            EntityUtilities.DATE_RANGE_START_KEY,
            testEntity,
            propertyKey,
            testEntityWithoutData,
            new Date((testEntity[propertyKey] as DateRange).start)
        );
    }
}

/**
 * Gets the date objects between the given start and end date.
 * You can additionally provide a filter function to that result.
 *
 * @param startDate - The start date. Is included in the result.
 * @param endDate - The end date. Is included in the result.
 * @param filter - An optional filter function used to further filter the result.
 * @returns The dates.
 */
export function getDatesBetween(
    startDate: Date,
    endDate: Date,
    filter?: DateFilterFn<Date>
): Date[] {
    const DAY_IN_MS: number = 1000 * 60 * 60 * 24;
    const res: Date[] = [];
    while (
        startDate.getFullYear() < endDate.getFullYear()
        || startDate.getMonth() < endDate.getMonth()
        || startDate.getDate() <= endDate.getDate()
    ) {
        res.push(new Date(startDate));
        startDate.setTime(startDate.getTime() + DAY_IN_MS);
    }
    if (filter) {
        return res.filter(d => filter(d));
    }
    else {
        return res;
    }
}