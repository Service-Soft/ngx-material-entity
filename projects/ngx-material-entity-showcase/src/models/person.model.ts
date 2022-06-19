import { Entity, EntityUtilities, string } from 'ngx-material-entity';
import { object } from 'projects/ngx-material-entity/src/public-api';
import { Address } from './address.model';


export class Person extends Entity {
    @string({
        displayName: 'Vorname',
        displayStyle: 'line'
    })
    firstname!: string;

    @string({
        displayName: 'Nachname',
        displayStyle: 'line'
    })
    lastname!: string;

    @string({
        displayName: 'Anrede',
        displayStyle: 'autocomplete',
        autocompleteValues: ['Herr', 'Frau']
    })
    formOfAddress!: string;

    @object({
        displayName: 'Adresse',
        displayStyle: 'inline',
        type: Address
    })
    address!: Address;

    constructor(entity?: Person) {
        super();
        EntityUtilities.new(this, entity);
        this.address = new Address(entity?.address);
    }
}