import { expect } from '@jest/globals';
import { EditData } from '../table-data';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../../../mocks/test-entity.interface';
import { EditDialogDataBuilder } from './edit-data.builder';

const editData: EditData<TestEntityWithoutCustomProperties> = {};
const entity: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;

describe('default values', () => {
    test('should have correct title', () => {
        expect(new EditDialogDataBuilder(editData).getResult().title(entity)).toBe('Edit');
    });
});