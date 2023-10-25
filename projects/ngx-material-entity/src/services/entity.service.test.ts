import { HttpClient } from '@angular/common/http';
import { expect } from '@jest/globals';
import { TestEntity as SimpleTestEntity } from '../classes/entity.model.test';
import { mockInjector } from '../mocks/environment-injector.mock';
import { HttpClientErrorMock, HttpClientMock } from '../mocks/http-client.mock';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../mocks/test-entity.interface';
import { TestEntity } from '../mocks/test-entity.mock';
import { EntityService } from './entity.service';

export class SimpleTestEntityService extends EntityService<SimpleTestEntity> {
    baseUrl: string = 'http://api/test';
}

export class TestEntityService extends EntityService<TestEntityWithoutCustomProperties> {
    baseUrl: string = 'http://api/test';


    protected override async createWithFormData(body: Omit<TestEntityWithoutCustomProperties, keyof TestEntityWithoutCustomProperties>): Promise<TestEntityWithoutCustomProperties> {
        return this.createWithJson(body);
    }

    protected override async updateWithFormData(
        body: Partial<TestEntityWithoutCustomProperties>,
        filePropertyKeys: (keyof TestEntityWithoutCustomProperties)[],
        entity: TestEntityWithoutCustomProperties,
        id: TestEntityWithoutCustomProperties[keyof TestEntityWithoutCustomProperties]
    ): Promise<void> {
        await this.updateWithJson(body, id);
    }
}

class SimpleErrorTestEntityService extends EntityService<SimpleTestEntity> {
    baseUrl: string = 'http://api/test';
}

const simpleTestEntityApiData: SimpleTestEntity[] = [];
const testEntityApiData: TestEntityWithoutCustomProperties[] = [];

test('should request TestEntities', async () => {
    const service: SimpleTestEntityService = new SimpleTestEntityService(new HttpClientMock(simpleTestEntityApiData) as unknown as HttpClient, mockInjector);
    const simpleTestEntity: SimpleTestEntity = new SimpleTestEntity({ id: '1', name: 'John Smith' });
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
    const entitiesFoundByRead: SimpleTestEntity[] = await service.read();
    expect(entitiesFoundByRead.length).toBe(2);
    // findById
    const findByIdService: SimpleTestEntityService = new SimpleTestEntityService(new HttpClientMock([]) as unknown as HttpClient, mockInjector);
    await findByIdService.create(new SimpleTestEntity({ id: '1', name: 'John Smith' }));
    expect(await findByIdService.findById('1')).toEqual({ id: '1', name: 'John Smith' });
    expect(await findByIdService.read()).toEqual([{ id: '1', name: 'John Smith' }]);
    expect(await findByIdService.findById('1')).toEqual({ id: '1', name: 'John Smith' });
    const cleanFindByIdService: SimpleTestEntityService = new SimpleTestEntityService(new HttpClientMock([{ id: '1', name: 'John Smith' }]) as unknown as HttpClient, mockInjector);
    cleanFindByIdService.lastRead = new Date();
    expect(await cleanFindByIdService.findById('1')).toEqual({ id: '1', name: 'John Smith' });
});

test('should create with form data when required', async () => {
    const service: TestEntityService = new TestEntityService(new HttpClientMock(testEntityApiData) as unknown as HttpClient, mockInjector);
    const testEntity: TestEntity = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;
    expect(service.entities.length).toBe(0);
    await service.create(testEntity);
    expect(service.entities.length).toBe(1);
});

test('should update with form data when required', async () => {
    const service: TestEntityService = new TestEntityService(new HttpClientMock(testEntityApiData) as unknown as HttpClient, mockInjector);
    const testEntityPriorChanges: TestEntity = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;
    await service.create(testEntityPriorChanges);
    const testEntity: TestEntity = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;
    testEntity.maxLengthStringValue = '5678';
    await service.update(testEntity, testEntityPriorChanges);
    expect(service.entities[0].maxLengthStringValue).toBe('5678');
});

test('should throw error when create does not return a result', async () => {
    const simpleTestEntity: SimpleTestEntity = new SimpleTestEntity({ id: '1', name: 'John Smith' });
    const service: SimpleErrorTestEntityService = new SimpleErrorTestEntityService(
        new HttpClientErrorMock([]) as unknown as HttpClient,
        mockInjector
    );
    const expectedEm: string = `
        The created entity was not returned in the response.
        If you want to provide a logic that allows that
        you need to override the create methods of this class.
    `;
    try {
        await service.create(simpleTestEntity);
        expect(true).toBe(false);
    }
    catch (error) {
        expect(flattenString((error as Error).message)).toEqual(flattenString(expectedEm));
    }
});

test('should warn in console but still update when patch does not return a result', async () => {
    const simpleTestEntity: SimpleTestEntity = new SimpleTestEntity({ id: '1', name: 'John Smith' });
    const service: SimpleErrorTestEntityService = new SimpleErrorTestEntityService(
        new HttpClientErrorMock([simpleTestEntity]) as unknown as HttpClient,
        mockInjector
    );
    const EXPECTED_WARNING: string = 'The updated entity was not returned in the response. Applying the changes from the request body.';

    // eslint-disable-next-line no-console
    console.warn = jest.fn();

    service.entities.push(simpleTestEntity);
    await service.update(new SimpleTestEntity({ id: '4', name: 'Jane Smith' }), new SimpleTestEntity(service.entities[0]));
    expect(service.entities[0].name).toBe('Jane Smith');
    expect(service.entities[0].id).toBe('1');
    expect(service.entities.length).toBe(1);
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledWith(EXPECTED_WARNING);
});

function flattenString(value: string): string {
    return value.split('\n').join('').replace(/\s/g, '');
}