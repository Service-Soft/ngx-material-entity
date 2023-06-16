import { expect } from '@jest/globals';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../../../mocks/test-entity.interface';
import { EditData } from '../table-data';
import { EditDialogDataBuilder } from './edit-data.builder';

const editData: EditData<TestEntityWithoutCustomProperties> = {};
const editDataWithActions: EditData<TestEntityWithoutCustomProperties> = {
    actions: [
        {
            displayName: 'Test',
            // eslint-disable-next-line no-console
            action: () => console.log(42)
        }
    ]
};
const entity: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;

describe('default values', () => {
    test('should have correct title', () => {
        expect(new EditDialogDataBuilder(editData).getResult().title(entity)).toBe('Edit');
    });

    test('should build the actions correctly', ()=> {
        expect(new EditDialogDataBuilder(editDataWithActions).getResult().actions[0].enabled(entity)).toBe(true);
    });
});