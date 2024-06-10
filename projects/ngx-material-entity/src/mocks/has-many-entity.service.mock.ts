/* eslint-disable jsdoc/require-jsdoc */
import { HasManyEntity } from './test-entity.interface';
import { EntityService } from '../services/entity.service';

export class HasManyEntityService extends EntityService<HasManyEntity> {
    baseUrl: string = 'http://localhost:3000/hasManyEntities';
}