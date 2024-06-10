/* eslint-disable jsdoc/require-jsdoc */
import { TestEntityWithoutCustomProperties } from './test-entity.interface';
import { EntityService } from '../services/entity.service';

export class TestEntityService extends EntityService<TestEntityWithoutCustomProperties> {
    baseUrl: string = 'http://localhost:3000/testEntities';
}