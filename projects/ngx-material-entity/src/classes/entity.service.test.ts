import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { TestEntity as SimpleTestEntity } from './entity.model.test';
import { TestEntity, TestEntityMockBuilder } from '../mocks/test-entity.mock';
import { HttpClientMock } from '../mocks/http-client.mock';
import { expect } from '@jest/globals';

export class SimpleTestEntityService extends EntityService<SimpleTestEntity> {
    baseUrl: string = 'http://api/test';
}

export class TestEntityService extends EntityService<TestEntity> {
    baseUrl: string = 'http://api/test';

    protected override async createWithFormData(body: Omit<TestEntity, keyof TestEntity>): Promise<TestEntity> {
        return this.createWithJson(body);
    }

    protected override async updateWithFormData(
        body: Partial<TestEntity>,
        filePropertyKeys: (keyof TestEntity)[],
        entity: TestEntity,
        id: TestEntity[keyof TestEntity]
    ): Promise<void> {
        this.updateWithJson(body, id);
    }
}

const simpleTestEntityApiData: SimpleTestEntity[] = [];
const testEntityApiData: TestEntity[] = [];

test('should request TestEntities', async () => {
    const service = new SimpleTestEntityService(new HttpClientMock(simpleTestEntityApiData) as unknown as HttpClient);
    const simpleTestEntity = new SimpleTestEntity({ id: '1', name: 'John Smith' });
    expect(service.baseUrl).toBe('http://api/test');
    expect(service.entities).toEqual([]);
    // create entity
    await service.create(simpleTestEntity);
    expect(service.entities).toEqual([{ id: '1', name: 'John Smith' }]);
    // update entity
    await service.update(new SimpleTestEntity({ id: '4', name: 'Jane Smith' }), new SimpleTestEntity(service.entities[0]));
    expect(service.entities[0].name).toBe('Jane Smith');
    expect(service.entities[0].id).toBe('1');
    expect(service.entities.length).toBe(1);
    // delete entity
    await service.delete(simpleTestEntity);
    expect(service.entities).toEqual([]);
    // read entities
    await service.create(new SimpleTestEntity({ id: '1', name: 'John Smith' }));
    await service.create(new SimpleTestEntity({ id: '2', name: 'Jane Smith' }));
    const entitiesFoundByRead = await service.read();
    expect(entitiesFoundByRead.length).toBe(2);
});

test('should create with form data when required', async () => {
    const service = new TestEntityService(new HttpClientMock(testEntityApiData) as unknown as HttpClient);
    const testEntity = new TestEntityMockBuilder().testEntity;
    expect(service.entities.length).toBe(0);
    await service.create(testEntity);
    expect(service.entities.length).toBe(1);
});

test('should update with form data when required', async () => {
    const service = new TestEntityService(new HttpClientMock(testEntityApiData) as unknown as HttpClient);
    const testEntityPriorChanges = new TestEntityMockBuilder().testEntity;
    await service.create(testEntityPriorChanges);
    const testEntity = new TestEntityMockBuilder().testEntity;
    testEntity.maxLengthStringValue = '5678';
    await service.update(testEntity, testEntityPriorChanges);
    expect(service.entities[0].maxLengthStringValue).toBe('5678');
});