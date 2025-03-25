import { array, DecoratorTypes, DropdownValue, number } from 'ngx-material-entity';

import { Month, monthNames } from './month.enum';
import { SportTime } from './sport-time.model';
import { formatTime } from '../services/format-time.function';

function getNumberDropdownValues(from: number, until: number, nameMapping: Record<number, string>): DropdownValue<number>[] {
    const res: DropdownValue<number>[] = [];
    for (let i: number = from; i <= until; i++) {
        res.push({ displayName: nameMapping[i], value: i });
    }
    return res;
}

export class SportTimes {

    @number({
        displayName: 'Gültig von',
        displayStyle: 'dropdown',
        dropdownValues: getNumberDropdownValues(Month.JANUARY, Month.DECEMBER, monthNames)
    })
    fromMonth: Month;

    @number({
        displayName: 'Gültig bis',
        displayStyle: 'dropdown',
        dropdownValues: getNumberDropdownValues(Month.JANUARY, Month.DECEMBER, monthNames)
    })
    untilMonth: Month;

    @array({
        displayName: 'Zeiten',
        itemType: DecoratorTypes.OBJECT,
        EntityClass: SportTime,
        displayColumns: [
            {
                displayName: 'Tag',
                value: t => t.day
            },
            {
                displayName: 'Zeit',
                value: t => `${formatTime(t.from)} - ${formatTime(t.until)}`
            },
            {
                displayName: 'Ort',
                value: t => t.location
            }
        ]
    })
    times: SportTime[];

    constructor(entity?: SportTimes) {
        this.times = entity?.times.map(t => new SportTime(t)) as SportTime[];
        this.fromMonth = entity?.fromMonth as Month;
        this.untilMonth = entity?.untilMonth as Month;
    }
}