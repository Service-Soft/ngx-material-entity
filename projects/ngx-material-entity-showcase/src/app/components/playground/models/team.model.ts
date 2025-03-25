import { array, DecoratorTypes, referencesMany, referencesOne, string } from 'ngx-material-entity';

import { BaseEntity } from './base-entity.model';
import { Member } from './member.model';
import { monthNames } from './month.enum';
import { SportTimes } from './sport-times.model';
import { getMembers } from '../services/get-members.function';

export class Team extends BaseEntity {

    @string({
        displayStyle: 'line',
        displayName: 'Name',
        position: {
            tab: -1,
            tabName: 'Allgemein'
        }
    })
    name: string;

    @referencesOne({
        displayName: 'Kontakt',
        EntityClass: Member,
        getReferencedEntities: getMembers,
        getDropdownValues: (entities) => entities.map(e => ({ displayName: e.name, value: e.id })),
        dropdownOnly: true
    })
    contactId: string;

    @array({
        displayName: 'Trainingszeiten',
        itemType: DecoratorTypes.OBJECT,
        EntityClass: SportTimes,
        displayColumns: [
            {
                displayName: 'Gültigkeit',
                value: t => `${monthNames[t.fromMonth]} - ${monthNames[t.untilMonth]}`
            }
        ],
        createInline: false,
        required: false
    })
    times: SportTimes[];

    @string({
        displayName: 'Spielklasse',
        displayStyle: 'line',
        required: false,
        position: {
            tab: 2,
            tabName: 'Erweitert'
        }
    })
    league: string | undefined;

    @string({
        displayName: 'Handball Net Team Id',
        displayStyle: 'line',
        required: false,
        position: {
            tab: 2,
            tabName: 'Erweitert'
        }
    })
    handballNetTeamId: string | undefined;

    @string({
        displayName: 'myTischtennis url',
        displayStyle: 'line',
        required: false,
        position: {
            tab: 2
        }
    })
    myTischtennisUrl: string | undefined;

    @string({
        displayName: 'fussball.de Tabellen Id',
        displayStyle: 'line',
        required: false,
        position: {
            tab: 2
        }
    })
    fussballDeTableId: string | undefined;

    @string({
        displayName: 'fussball.de Spielplan Id',
        displayStyle: 'line',
        required: false,
        position: {
            tab: 2
        }
    })
    fussballDeMatchScheduleId: string | undefined;

    @referencesMany({
        displayName: 'Spieler',
        displayColumns: [
            {
                displayName: 'Name',
                value: p => p.name
            }
        ],
        getReferencedEntities: getMembers,
        getDropdownValues: players => players.map(p => ({ displayName: p.name, value: p.id })),
        required: false
    })
    playerIds: string[];

    sportId: string;

    players: Member[];

    contact: Member;

    constructor(entity?: Team) {
        super(entity);
        this.name = entity?.name as string;
        this.contactId = entity?.contactId as string;
        this.sportId = entity?.sportId as string;
        this.times = entity?.times.map(t => new SportTimes(t)) as SportTimes[];
        this.contact = new Member(entity?.contact);
        this.handballNetTeamId = entity?.handballNetTeamId;
        this.myTischtennisUrl = entity?.myTischtennisUrl;
        this.fussballDeTableId = entity?.fussballDeTableId;
        this.fussballDeMatchScheduleId = entity?.fussballDeMatchScheduleId;
        this.playerIds = entity?.playerIds as string[];
        this.players = entity?.players.map(p => new Member(p)) as Member[];
        this.league = entity?.league;
    }
}