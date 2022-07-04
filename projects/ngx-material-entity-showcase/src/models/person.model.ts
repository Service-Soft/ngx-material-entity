import { array, Entity, EntityUtilities, string, DecoratorTypes, object } from 'ngx-material-entity';
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
    })
    lastname!: string;

    @string({
        displayName: 'Anrede',
        displayStyle: 'autocomplete',
        order: 1,
        autocompleteValues: ['Herr', 'Frau'],
        defaultWidths: [3, 6, 6]
    })
    formOfAddress!: string;

    @object({
        displayName: 'Hauptadresse',
        displayStyle: 'inline',
        type: Address,
        defaultWidths: [12, 12, 12]
    })
    address!: Address;

    @array({
        order: 1,
        itemType: DecoratorTypes.OBJECT,
        displayName: 'Adressen',
        displayStyle: 'table',
        EntityClass: Address,
        displayColumns: [
            {
                displayName: 'Straße',
                value: (entity: Address) => `${entity.street} ${entity.number}`
            },
            {
                displayName: 'Ort',
                value: (entity: Address) => `${entity.postcode} ${entity.city}`
            }
        ],
        defaultWidths: [12, 12, 12],
        createDialogData: {
            title: 'Adresse hinzufügen',
            createButtonLabel: 'Hinzufügen'
        },
        missingErrorMessage: 'Muss mindestens einen Wert enthalten'
    })
    addresses!: Address[];

    @array({
        displayName: 'Kategorien',
        itemType: DecoratorTypes.STRING_AUTOCOMPLETE,
        displayStyle: 'chips',
        deleteHtml: '<span class="material-icons">home</span>',
        autocompleteValues: ['Elektronik', 'Lebensmittel'],
        minLength: 5
    })
    categories!: string[]

    constructor(entity?: Person) {
        super();
        EntityUtilities.new(this, entity);
        this.address = new Address(entity?.address);
    }
}