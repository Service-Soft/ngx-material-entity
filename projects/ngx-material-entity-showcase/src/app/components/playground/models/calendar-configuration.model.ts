import { string } from 'ngx-material-entity';

import { BaseEntity } from './base-entity.model';
import { CalendarType } from './calendar-type.enum';

export class CalendarConfiguration extends BaseEntity {
    @string({
        displayName: 'Name',
        displayStyle: 'line'
    })
    name: string;

    @string({
        displayName: 'Typ',
        displayStyle: 'dropdown',
        dropdownValues: Object.values(CalendarType).map(v => ({ displayName: v, value: v })),
        default: CalendarType.GOOGLE
    })
    type: CalendarType;

    @string({
        displayName: 'Google Kalender Id',
        displayStyle: 'line',
        display: (c: CalendarConfiguration) => c.type === CalendarType.GOOGLE
    })
    googleCalendarId: string | undefined;

    sportId: string;

    constructor(entity?: CalendarConfiguration) {
        super(entity);
        this.name = entity?.name as string;
        this.type = entity?.type as CalendarType;
        this.googleCalendarId = entity?.googleCalendarId;
        this.sportId = entity?.sportId as string;
    }
}