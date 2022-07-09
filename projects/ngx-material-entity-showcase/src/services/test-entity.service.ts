import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityService } from 'ngx-material-entity';
import { TestEntity } from '../../../ngx-material-entity/src/mocks/test-entity.mock';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TestEntityService extends EntityService<TestEntity> {
    baseUrl: string = `${environment.apiUrl}/testEntities`;

    constructor(private readonly httpClient: HttpClient) {
        super(httpClient);
    }
}