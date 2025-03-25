import { DropdownValue, number, object, string } from 'ngx-material-entity';

import { SportLocation } from './sport-location.enum';
import { Weekday } from './weekday.enum';

function getNumberDropdownValues(from: number, until: number): DropdownValue<number>[] {
    const res: DropdownValue<number>[] = [];
    for (let i: number = from; i < until; i++) {
        res.push({ displayName: `${i}`, value: i });
    }
    return res;
}

class Time {
    @number({
        displayName: 'Stunden',
        displayStyle: 'dropdown',
        dropdownValues: getNumberDropdownValues(0, 23)
    })
    hours: number;

    @number({
        displayName: 'Minuten',
        displayStyle: 'dropdown',
        dropdownValues: getNumberDropdownValues(0, 59)
    })
    minutes: number;

    constructor(entity?: Time) {
        this.hours = entity?.hours as number;
        this.minutes = entity?.minutes as number;
    }
}

export class SportTime {

    @string({
        displayName: 'Tag',
        displayStyle: 'dropdown',
        dropdownValues: Object.values(Weekday).map(d => ({ displayName: d, value: d }))
    })
    day: Weekday;

    @string({
        displayName: 'Ort',
        displayStyle: 'autocomplete',
        autocompleteValues: Object.values(SportLocation)
        // restrictToOptions
    })
    location: `${string}${SportLocation}${string}`;

    @object({
        displayName: 'Von',
        displayStyle: 'inline',
        EntityClass: Time,
        defaultWidths: [6, 6, 12]
    })
    from: Time;

    @object({
        displayName: 'Bis',
        displayStyle: 'inline',
        EntityClass: Time,
        defaultWidths: [6, 6, 12]
    })
    until: Time;

    constructor(entity?: SportTime) {
        this.day = entity?.day as Weekday;
        this.location = entity?.location as `${string}${SportLocation}${string}`;
        this.from = new Time(entity?.from);
        this.until = new Time(entity?.until);
    }
}