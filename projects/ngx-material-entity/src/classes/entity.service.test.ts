import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { TestEntity as SimpleTestEntity } from './entity.model.test';
import { HttpClientMock } from '../mocks/http-client.mock';
import { expect } from '@jest/globals';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../mocks/test-entity.interface';

export class SimpleTestEntityService extends EntityService<SimpleTestEntity> {
    baseUrl: string = 'http://api/test';
}

export class TestEntityService extends EntityService<TestEntityWithoutCustomProperties> {
    baseUrl: string = 'http://api/test';

    // eslint-disable-next-line max-len
    protected override async createWithFormData(body: Omit<TestEntityWithoutCustomProperties, keyof TestEntityWithoutCustomProperties>): Promise<TestEntityWithoutCustomProperties> {
        return this.createWithJson(body);
    }

    protected override async updateWithFormData(
        body: Partial<TestEntityWithoutCustomProperties>,
        filePropertyKeys: (keyof TestEntityWithoutCustomProperties)[],
        entity: TestEntityWithoutCustomProperties,
        id: TestEntityWithoutCustomProperties[keyof TestEntityWithoutCustomProperties]
    ): Promise<void> {
        void this.updateWithJson(body, id);
    }
}

const simpleTestEntityApiData: SimpleTestEntity[] = [];
const testEntityApiData: TestEntityWithoutCustomProperties[] = [];

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
    const testEntity = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;
    expect(service.entities.length).toBe(0);
    await service.create(testEntity);
    expect(service.entities.length).toBe(1);
});

test('should update with form data when required', async () => {
    const service = new TestEntityService(new HttpClientMock(testEntityApiData) as unknown as HttpClient);
    const testEntityPriorChanges = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;
    await service.create(testEntityPriorChanges);
    const testEntity = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;
    testEntity.maxLengthStringValue = '5678';
    await service.update(testEntity, testEntityPriorChanges);
    expect(service.entities[0].maxLengthStringValue).toBe('5678');
});