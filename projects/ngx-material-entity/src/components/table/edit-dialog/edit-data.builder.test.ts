import { expect } from '@jest/globals';

import { EditDataBuilder } from './edit-data.builder';
import { defaultGlobalDefaults } from '../../../default-global-configuration-values';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../../../mocks/test-entity.interface';
import { EditData } from '../table-data';

const editData: EditData<TestEntityWithoutCustomProperties> = {};
const editDataWithActions: EditData<TestEntityWithoutCustomProperties> = {
    actions: [
        {
            displayName: 'Test',
            // eslint-disable-next-line no-console
            action: () => console.log(42)
        },
        {
            displayName: 'Test Async',
            // eslint-disable-next-line no-console
            action: async () => console.log(42)
        }
    ]
};
const entity: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;

describe('default values', () => {
    test('should have correct title', () => {
        // eslint-disable-next-line stylistic/newline-per-chained-call
        expect(new EditDataBuilder(defaultGlobalDefaults, editData).getResult().title(entity)).toBe('Edit');
    });

    test('should build the actions correctly', () => {
        expect(new EditDataBuilder(defaultGlobalDefaults, editDataWithActions).getResult().actions[0].enabled(entity)).toBe(true);
    });
});