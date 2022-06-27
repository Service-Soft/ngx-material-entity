import { Component } from '@angular/core';
import { EntitiesData } from 'ngx-material-entity';
import { Person } from '../models/person.model';
import { PersonService } from '../services/person.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private readonly personService: PersonService) {}

    entitiesData: EntitiesData<Person> = {
        baseData: {
            title: 'Personen',
            displayColumns: [
                {
                    displayName: 'Name',
                    value: (entity: Person) => `${entity.firstname} ${entity.lastname}`
                },
                {
                    displayName: 'Adresse',
                    value: (entity: Person) => `${entity.address.street} ${entity.address.number}, ${entity.address.postcode} ${entity.address.city}`
                }
            ],
            EntityClass: Person,
            EntityServiceClass: PersonService,
            multiSelectActions: [
                {
                    displayName: 'Logge Vornamen',
                    action: (entities: Person[]) => entities.forEach(e => console.log(e.firstname))
                },
                {
                    displayName: 'Löschen',
                    action: (entities: Person[]) => entities.forEach(e => this.personService.delete(e.id)),
                    requireConfirmDialog: (entities: Person[]) => true
                }
            ],
            allowDelete: (entity: Person) => false
        },
        createDialogData: {
            title: 'Person erstellen'
        },
        editDialogData: {
            title: (entity: Person) => `Person #${entity.id}`,
            deleteRequiresConfirmDialog: false,
        }
    }
}