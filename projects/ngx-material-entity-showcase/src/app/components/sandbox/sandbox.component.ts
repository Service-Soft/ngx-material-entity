/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import {array, DecoratorTypes, Entity, EntityService, EntityUtilities, string, TableData } from 'ngx-material-entity';
import { environment } from '../../../environments/environment';

class Address {
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
        minLength: 5
    })
    postcode!: string;

    @string({
        displayName: 'City',
        displayStyle: 'line'
    })
    city!: string;

    constructor(entity?: Address) {
        EntityUtilities.new(this, entity);
    }
}

class Person extends Entity {

    @string({
        displayName: 'First Name',
        displayStyle: 'line'
    })
    firstName!: string;

    @string({
        displayName: 'Last Name',
        displayStyle: 'line'
    })
    lastName!: string;

    @array({
        displayName: 'Addresses',
        itemType: DecoratorTypes.OBJECT,
        EntityClass: Address,
        displayColumns: [
            {
                displayName: 'Address',
                value: (address: Address) => `${address.street} ${address.number}, ${address.postcode} ${address.city}`
            }
        ]
    })
    addresses!: Address[];

    constructor(entity?: Person) {
        super();
        EntityUtilities.new(this, entity);
    }
}

@Injectable({
    providedIn: 'root'
})
export class PersonService extends EntityService<Person> {
    baseUrl: string = `${environment.apiUrl}/persons`;

    constructor(private readonly httpClient: HttpClient) {
        super(httpClient);
    }
}

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
                }
            ],
            EntityClass: Person,
            EntityServiceClass: PersonService,
            allowUpdate: () => false
        },
        createDialogData: {
            title: 'Create Person'
        },
        editDialogData: {
            title: (entity: Person) => `${entity.firstName} ${entity.lastName}`
        }
    };
}