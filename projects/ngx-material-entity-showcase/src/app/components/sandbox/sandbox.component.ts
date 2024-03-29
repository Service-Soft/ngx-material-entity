/* eslint-disable jsdoc/require-jsdoc */
import { formatDate, formatNumber } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, Injectable, inject } from '@angular/core';
import { DecoratorTypes, DropdownValue, Entity, EntityService, EntityUtilities, TableData, array, boolean, date, hasMany, number, object, referencesMany, referencesOne, string } from 'ngx-material-entity';
import { environment } from '../../../environments/environment';
import { PdfDownloadDisplayValueComponent } from '../pdf-download-display-value/pdf-download-display-value.component';

@Injectable({
    providedIn: 'root'
})
export class PersonService extends EntityService<Person> {
    baseUrl: string = `${environment.apiUrl}/persons`;

    constructor(http: HttpClient, injector: EnvironmentInjector) {
        super(http, injector);
    }
}

@Injectable({
    providedIn: 'root'
})
export class AddressService extends EntityService<Address> {
    baseUrl: string = `${environment.apiUrl}/addresses`;

    constructor(http: HttpClient, injector: EnvironmentInjector) {
        super(http, injector);
    }
}

class Address extends Entity {

    @string({
        displayName: 'Form of Address',
        displayStyle: 'autocomplete',
        autocompleteValues: ['Mr.', 'Ms.'],
        restrictToOptions: true
    })
    formOfAddress!: string;

    @string({
        displayName: 'Street',
        displayStyle: 'line'
    })
    street!: string;

    @string({
        displayName: 'Number',
        displayStyle: 'line'
    })
    number!: string;

    @string({
        displayName: 'Postcode',
        displayStyle: 'line',
        regex: new RegExp('^[0-9]+$'),
        maxLength: 5,
        minLength: 5,
        change: (entity: Address) => entity.city = undefined as unknown as string
    })
    postcode!: string;

    @string({
        displayName: 'City',
        displayStyle: 'line'
    })
    city!: string;

    constructor(entity?: Address) {
        super(entity);
        EntityUtilities.new(this, entity);
    }
}

class TimeTracking extends Entity {

    @date({
        displayName: 'Date',
        displayStyle: 'date'
    })
    date!: Date;

    @number({
        displayName: 'Hours',
        displayStyle: 'line',
        defaultWidths: [3, 3, 3]
    })
    hours!: number;

    @number({
        displayName: 'Minutes',
        displayStyle: 'line',
        max: 60,
        defaultWidths: [3, 3, 3]
    })
    minutes!: number;

    @boolean({
        displayName: 'Used for invoice?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No',
        isReadOnly: (entity: TimeTracking) => entity.usedForInvoice
    })
    usedForInvoice!: boolean;

    constructor(entity?: TimeTracking) {
        super(entity);
        EntityUtilities.new(this, entity);
    }
}

export class Person extends Entity {

    @string({
        displayName: 'First Name',
        displayStyle: 'line',
        default: 'James'
    })
    firstName!: string;

    @string({
        displayName: 'Last Name',
        displayStyle: 'line',
        default: () => 'Smith'
    })
    lastName!: string;

    @object({
        displayName: 'Optional Partial Address',
        displayStyle: 'inline',
        EntityClass: Address,
        required: false,
        omit: ['postcode']
    })
    address?: Omit<Address, 'postcode'>;

    @referencesMany({
        displayName: 'Addresses',
        getReferencedEntities: getReferencedEntities,
        getDropdownValues: getDropdownValues,
        displayColumns: [
            {
                displayName: 'Address',
                value: (address: Address) => `${address?.street} ${address?.number}, ${address?.postcode} ${address?.city}`
            }
        ]
    })
    addressIds!: string[];

    @referencesOne({
        displayName: 'Single Address',
        getReferencedEntities: getReferencedEntities,
        getDropdownValues: getDropdownValues,
        EntityClass: Address
    })
    addressId!: string;

    @array({
        displayName: 'Time Trackings',
        itemType: DecoratorTypes.OBJECT,
        EntityClass: TimeTracking,
        displayColumns: [
            {
                displayName: 'Date',
                value: e => formatDate(e.date, 'dd.MM.yyyy', 'en')
            },
            {
                displayName: 'Time',
                value: e => `${formatNumber(e.hours, 'en', '2.0-0')}:${formatNumber(e.minutes, 'en', '2.0-0')}`
            },
            {
                displayName: 'Used?',
                value: e => e.usedForInvoice ? 'Yes' : 'No'
            }
        ],
        omitForCreate: true,
        required: false
    })
    timeTrackings!: TimeTracking[];

    @hasMany({
        tableData: {
            baseData: {
                title: 'Addresses',
                displayColumns: [
                    {
                        displayName: 'Street',
                        value: e => e.street
                    },
                    {
                        displayName: 'Pdf',
                        value: () => '',
                        Component: PdfDownloadDisplayValueComponent,
                        disableClick: true
                    }
                ],
                EntityServiceClass: AddressService,
                EntityClass: Address
            },
            createData: {}
        },
        RelatedEntityServiceClass: PersonService,
        displayName: 'Addresses',
        position: {
            tab: 2,
            tabName: 'Addresses'
        }
    })
    addresses!: Address[];

    @object({
        displayName: 'Address',
        displayStyle: 'inline',
        EntityClass: Address,
        position: {
            tab: 2,
            tabName: 'Addresses'
        }
    })
    addressObject!: Address[];

    constructor(entity?: Person) {
        super(entity);
        EntityUtilities.new(this, entity);
    }
}

async function getReferencedEntities(): Promise<Address[]> {
    const addressService: AddressService = inject(AddressService);
    return addressService.read();
}

function getDropdownValues(entities: Address[]): DropdownValue<string>[] {
    return entities.map(e => {
        return {
            displayName: `${e.street} ${e.number}, ${e.postcode} ${e.city}`,
            value: e.id
        };
    });
}

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'app-sandbox',
    templateUrl: './sandbox.component.html',
    styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent {
    tableConfig: TableData<Person> = {
        baseData: {
            title: 'Custom Persons',
            displayColumns: [
                {
                    displayName: 'ID',
                    value: (entity: Person) => entity.id
                },
                {
                    displayName: 'Name',
                    value: (entity: Person) => `${entity.firstName} ${entity.lastName}`
                },
                {
                    displayName: 'Pdf',
                    value: () => '',
                    Component: PdfDownloadDisplayValueComponent,
                    disableClick: true
                }
            ],
            EntityClass: Person,
            EntityServiceClass: PersonService,
            dynamicRowStyleClasses: (entity: Person) => {
                if (entity.firstName === 'Jane') {
                    return ['red'];
                }
                return [];
            }
            // allowUpdate: () => false
        },
        createData: {
            title: 'Create Person'
        },
        editData: {
            title: (entity: Person) => `${entity.firstName} ${entity.lastName}`,
            actions: [
                {
                    displayName: 'Set first name to Jane',
                    action: (e: Person) => e.firstName = 'Jane'
                }
            ]
        }
    };
}