import 'reflect-metadata';
import { TestEntity, TestEntityMockBuilder } from './projects/ngx-material-entity/src/mocks/test-entity.mock';

interface ApiData {
    testEntities: TestEntity[]
}
export const apiData: ApiData = {
    testEntities: [
        new TestEntityMockBuilder().testEntity
    ]
};