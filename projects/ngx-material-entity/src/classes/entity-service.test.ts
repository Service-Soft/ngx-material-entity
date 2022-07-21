import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity-service.class';
import { TestEntity } from './entity-model.test';
import { HttpClientMock } from '../mocks/http-client.mock';
import { expect } from '@jest/globals';

export class TestEntityService extends EntityService<TestEntity> {
    baseUrl: string = 'http://api/test';
}

const apiTestData: TestEntity[] = [];

// TODO: Entities need to be created with new constructor. Otherwise the decorator metadata is missing.
// SOLUTIONS: Disable direct creation via JSON.

test('should request TestEntities', async () => {
    const service = new TestEntityService(new HttpClientMock(apiTestData) as unknown as HttpClient);
    const testEntity = new TestEntity({ id: '1', name: 'John Smith' });
    expect(service.baseUrl).toBe('http://api/test');
    expect(service.entities).toEqual([]);
    // create entity
    await service.create(testEntity);
    expect(service.entities).toEqual([{ id: '1', name: 'John Smith' }]);
    // update entity
    await service.update(new TestEntity({ id: '4', name: 'Jane Smith' }), service.entities[0]);
    expect(service.entities[0].name).toBe('Jane Smith');
    expect(service.entities[0].id).toBe('1');
    expect(service.entities.length).toBe(1);
    // delete entity
    await service.delete(testEntity.id);
    expect(service.entities).toEqual([]);
    // read entities
    await service.create(new TestEntity({ id: '1', name: 'John Smith' }));
    await service.create(new TestEntity({ id: '2', name: 'Jane Smith' }));
    const entitiesFoundByRead = await service.read();
    expect(entitiesFoundByRead.length).toBe(2);
});