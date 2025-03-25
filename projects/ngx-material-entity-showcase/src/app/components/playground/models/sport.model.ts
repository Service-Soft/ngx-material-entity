import { hasMany, object, string } from 'ngx-material-entity';

import { BaseEntity } from './base-entity.model';
import { CalendarConfiguration } from './calendar-configuration.model';
import { SportName } from './sport-name.enum';
import { Team } from './team.model';
import { CalendarConfigurationService } from '../services/calendar-configuration.service';
import { SportService } from '../services/sport.service';
import { TeamService } from '../services/team.service';

class ContactData {

    @string({
        displayName: 'E-Mail',
        displayStyle: 'line'
    })
    email: string;

    @string({
        displayName: 'Telefon',
        displayStyle: 'line',
        required: false
    })
    phone: string | undefined;

    constructor(data?: ContactData) {
        this.email = data?.email as string;
        this.phone = data?.phone;
    }
}

export class Sport extends BaseEntity {

    @string({
        displayName: 'Name',
        displayStyle: 'line',
        isReadOnly: true
    })
    name: SportName;

    @string({
        displayName: 'Kurzbeschreibung',
        displayStyle: 'textbox',
        defaultWidths: [12, 12, 12]
    })
    description: string;

    @hasMany({
        displayName: 'Teams',
        RelatedEntityServiceClass: SportService,
        tableData: {
            baseData: {
                displayColumns: [
                    {
                        displayName: 'Name',
                        value: t => t.name
                    }
                ],
                EntityServiceClass: TeamService,
                title: 'Teams',
                EntityClass: Team
            }
        }
    })
    teams: Team[];

    @hasMany({
        displayName: 'Kalender',
        RelatedEntityServiceClass: SportService,
        tableData: {
            baseData: {
                displayColumns: [
                    {
                        displayName: 'Name',
                        value: t => t.name
                    }
                ],
                EntityServiceClass: CalendarConfigurationService,
                title: 'Kalender',
                EntityClass: CalendarConfiguration
            }
        }
    })
    calendars: CalendarConfiguration[];

    @string({
        displayStyle: 'line',
        displayName: 'Externe Website',
        required: false
    })
    href: string | undefined;

    @object({
        displayName: 'Kontaktdaten',
        displayStyle: 'inline',
        EntityClass: ContactData
    })
    contact: ContactData;

    constructor(entity?: Sport) {
        super(entity);
        this.name = entity?.name as SportName;
        this.description = entity?.description as string;
        this.teams = entity?.teams.map(t => new Team(t)) as Team[];
        this.calendars = entity?.calendars.map(t => new CalendarConfiguration(t)) as CalendarConfiguration[];
        this.contact = new ContactData(entity?.contact);
        this.href = entity?.href;
    }
}