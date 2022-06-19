import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityService } from 'ngx-material-entity';
import { environment } from '../environments/environment';
import { Person } from '../models/person.model';

@Injectable({
    providedIn: 'root'
})
export class PersonService extends EntityService<Person> {
    baseUrl: string = `${environment.apiUrl}/persons`;

    constructor(private readonly httpClient: HttpClient) {
        super(httpClient);
    }
}