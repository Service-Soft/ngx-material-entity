/* eslint-disable jsdoc/require-jsdoc */
import { DateFilterFn } from '@angular/material/datepicker';
import 'reflect-metadata';
import { TestEntityWithoutCustomPropertiesInterface } from './projects/ngx-material-entity/src/mocks/test-entity.interface';

function getDatesBetween(
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

const testEntityData: TestEntityWithoutCustomPropertiesInterface = {
    id: '1',
    secondTabValue: 'Second tab value',
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

interface Address {
    id: string,
    street: string,
    number: string,
    postcode: string,
    city: string
}

interface Person {
    id: string,
    firstName: string,
    lastName: string,
    addressIds: string[]
}

const personData: Person = {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    addressIds: ['1']
};

const addressData: Address = {
    id: '1',
    street: 'Example Street',
    number: '42',
    postcode: '12345',
    city: 'Example City'
};

export interface ApiData {
    testEntities: TestEntityWithoutCustomPropertiesInterface[],
    persons: Person[],
    addresses: Address[]
}
export const apiData: ApiData = {
    testEntities: [
        testEntityData
    ],
    persons: [
        personData
    ],
    addresses: [
        addressData
    ]
};