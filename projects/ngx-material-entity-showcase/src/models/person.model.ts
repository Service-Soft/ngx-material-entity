import { Entity, EntityUtilities, string } from 'ngx-material-entity';
import { object } from 'projects/ngx-material-entity/src/public-api';
import { Address } from './address.model';


export class Person extends Entity {
    @string({
        displayName: 'Vorname',
        displayStyle: 'line',
        order: 2
    })
    firstname!: string;

    @string({
        displayName: 'Nachname',
        displayStyle: 'line',
        order: 3
        // lineBreakAfter: true
    })
    lastname!: string;

    @string({
        displayName: 'Anrede',
        displayStyle: 'autocomplete',
        order: 1,
        autocompleteValues: ['Herr', 'Frau']
    })
    formOfAddress!: string;

    @object({
        displayName: 'Adresse',
        displayStyle: 'inline',
        type: Address,
        defaultWidths: [12, 12, 12]
    })
    address!: Address;

    constructor(entity?: Person) {
        super();
        EntityUtilities.new(this, entity);
        this.address = new Address(entity?.address);
    }
}