import { Entity, EntityUtilities, string } from 'ngx-material-entity';

export class Address extends Entity {
    @string({
        displayName: 'Straße',
        displayStyle: 'line'
    })
    street!: string;

    @string({
        displayName: 'Hausnummer',
        displayStyle: 'line'
    })
    number!: string;

    @string({
        displayName: 'PLZ',
        displayStyle: 'line',
        minLength: 5,
        maxLength: 5,
        regex: new RegExp('^[0-9]+$')
    })
    postcode!: string;

    @string({
        displayName: 'Ort',
        displayStyle: 'line'
    })
    city!: string;

    constructor(entity?: Address) {
        super();
        EntityUtilities.new(this, entity);
    }
}