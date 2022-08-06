import { expect } from '@jest/globals';
import { TestEntity, TestEntityMockBuilder } from '../mocks/test-entity.mock';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { DateUtilities } from './date.utilities';
import { EntityUtilities } from './entity.utilities';
import { DateTimeDateDecoratorConfigInternal } from '../decorators/date/date-decorator-internal.data';
import { Time } from '@angular/common';
import { DropdownValue } from '../decorators/base/dropdown-value.interface';
import { LodashUtilities } from '../capsulation/lodash.utilities';

const builder = new TestEntityMockBuilder();
const testEntity: TestEntity = builder.testEntity;

describe('getTimeFromDate', () => {
    test('with correct Date (hours: 0, minutes: 0)', () => {
        expect(DateUtilities.getTimeFromDate(new Date(2022, 0, 1, 0, 0))).toEqual({hours: 0, minutes: 0});
    });
    test('with no Date', () => {
        expect(DateUtilities.getTimeFromDate(DateUtilities.asDate(undefined))).toEqual(undefined);
    });
});

describe('getValidTimesForDropdown', () => {
    test('getValidTimesForDropdown', () => {
        const tE: TestEntity = LodashUtilities.cloneDeep(testEntity);
        // eslint-disable-next-line max-len
        const metadata: DateTimeDateDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(tE, 'customDateTimeValue', DecoratorTypes.DATE_TIME);
        const result: DropdownValue<Time>[] = DateUtilities.getValidTimesForDropdown(
            tE.customDateTimeValue,
            metadata.times,
            metadata.minTime,
            metadata.maxTime,
            metadata.filterTime
        );
        const expectedResult: DropdownValue<Time>[] = [
            {
                displayName: '-',
                value: undefined as unknown as Time
            },
            {
                displayName: '8:30 AM',
                value: {
                    hours: 8,
                    minutes: 30
                }
            },
            {
                displayName: '8:45 AM',
                value: {
                    hours: 8,
                    minutes: 45
                }
            },
            {
                displayName: '9:00 AM',
                value: {
                    hours: 9,
                    minutes: 0
                }
            },
            {
                displayName: '9:15 AM',
                value: {
                    hours: 9,
                    minutes: 15
                }
            },
            {
                displayName: '9:30 AM',
                value: {
                    hours: 9,
                    minutes: 30
                }
            },
            {
                displayName: '9:45 AM',
                value: {
                    hours: 9,
                    minutes: 45
                }
            },
            {
                displayName: '10:00 AM',
                value: {
                    hours: 10,
                    minutes: 0
                }
            },
            {
                displayName: '10:15 AM',
                value: {
                    hours: 10,
                    minutes: 15
                }
            },
            {
                displayName: '10:30 AM',
                value: {
                    hours: 10,
                    minutes: 30
                }
            },
            {
                displayName: '10:45 AM',
                value: {
                    hours: 10,
                    minutes: 45
                }
            },
            {
                displayName: '11:00 AM',
                value: {
                    hours: 11,
                    minutes: 0
                }
            },
            {
                displayName: '11:15 AM',
                value: {
                    hours: 11,
                    minutes: 15
                }
            },
            {
                displayName: '11:30 AM',
                value: {
                    hours: 11,
                    minutes: 30
                }
            },
            {
                displayName: '11:45 AM',
                value: {
                    hours: 11,
                    minutes: 45
                }
            },
            {
                displayName: '1:00 PM',
                value: {
                    hours: 13,
                    minutes: 0
                }
            },
            {
                displayName: '1:15 PM',
                value: {
                    hours: 13,
                    minutes: 15
                }
            },
            {
                displayName: '1:30 PM',
                value: {
                    hours: 13,
                    minutes: 30
                }
            },
            {
                displayName: '1:45 PM',
                value: {
                    hours: 13,
                    minutes: 45
                }
            },
            {
                displayName: '2:00 PM',
                value: {
                    hours: 14,
                    minutes: 0
                }
            },
            {
                displayName: '2:15 PM',
                value: {
                    hours: 14,
                    minutes: 15
                }
            },
            {
                displayName: '2:30 PM',
                value: {
                    hours: 14,
                    minutes: 30
                }
            },
            {
                displayName: '2:45 PM',
                value: {
                    hours: 14,
                    minutes: 45
                }
            },
            {
                displayName: '3:00 PM',
                value: {
                    hours: 15,
                    minutes: 0
                }
            },
            {
                displayName: '3:15 PM',
                value: {
                    hours: 15,
                    minutes: 15
                }
            },
            {
                displayName: '3:30 PM',
                value: {
                    hours: 15,
                    minutes: 30
                }
            },
            {
                displayName: '3:45 PM',
                value: {
                    hours: 15,
                    minutes: 45
                }
            },
            {
                displayName: '4:00 PM',
                value: {
                    hours: 16,
                    minutes: 0
                }
            },
            {
                displayName: '4:15 PM',
                value: {
                    hours: 16,
                    minutes: 15
                }
            },
            {
                displayName: '4:30 PM',
                value: {
                    hours: 16,
                    minutes: 30
                }
            }
        ];
        expect(result).toEqual(expectedResult);
    });
});