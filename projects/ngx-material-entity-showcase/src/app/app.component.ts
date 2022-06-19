import { Component } from '@angular/core';
import { MultiSelectAction } from 'ngx-material-entity';
import { DisplayColumn, EntityUtilities } from 'ngx-material-entity';
import { Person } from '../models/person.model';
import { PersonService } from '../services/person.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    EntityClass = Person;
    EntityServiceClass = PersonService;
    displayColumns: DisplayColumn<Person>[] = [
        {
            displayName: 'Name',
            value: (entity: Person) => entity.firstname + ' ' + entity.lastname
        },
        {
            displayName: 'Adresse',
            value: (entity: Person) => `${entity.address.street} ${entity.address.number}, ${entity.address.postcode} ${entity.address.city}`
        }
    ];
    title: string = 'Personen';
    multiSelectActions: MultiSelectAction<Person>[] = [
        {
            displayName: 'Logge Vornamen',
            action: (entities: Person[]) => entities.forEach(e => console.log(e.firstname))
        }
    ];
}