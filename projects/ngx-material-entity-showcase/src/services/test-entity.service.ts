/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityService } from 'ngx-material-entity';
import { TestEntity } from '../../../ngx-material-entity/src/mocks/test-entity.mock';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TestEntityService extends EntityService<TestEntity> {
    readonly baseUrl: string = `${environment.apiUrl}/testEntities`;

    override readonly editBaseRoute: string = 'test-entities';

    constructor(private readonly httpClient: HttpClient) {
        super(httpClient);
    }

    protected override async createWithFormData(body: Omit<TestEntity, keyof TestEntity>): Promise<TestEntity> {
        return this.createWithJson(body);
    }

    protected override async updateWithFormData(
        body: Partial<TestEntity>,
        filePropertyKeys: (keyof TestEntity)[],
        entity: TestEntity,
        id: TestEntity[keyof TestEntity]
    ): Promise<void> {
        return this.updateWithJson(body, id);
    }
}