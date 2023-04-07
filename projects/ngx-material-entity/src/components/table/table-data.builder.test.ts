/* eslint-disable no-console */
import { expect } from '@jest/globals';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../../mocks/test-entity.interface';
import { TestEntityService } from '../../services/entity.service.test';
import { TableData } from './table-data';
import { TableDataBuilder, defaultSearchFunction } from './table-data.builder';

const baseTableData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        title: '',
        EntityServiceClass: TestEntityService,
        EntityClass: TestEntityWithoutCustomProperties,
        displayColumns: []
    }
};

const tableData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        ...baseTableData.baseData,
        allowCreate: false,
        allowDelete: true,
        allowRead: () => true
    }
};

const selectErrorData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        ...baseTableData.baseData,
        title: '',
        displayColumns: [
            {
                displayName: 'select',
                value: e => e.stringDropdownValue
            }
        ],
        multiSelectActions: [
            {
                displayName: 'Log test',
                action: () => console.log('test')
            }
        ]
    }
};

const noEntityClassAllowCreateErrorData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        ...baseTableData.baseData,
        EntityClass: undefined
    }
};

const noEntityClassAllowReadErrorData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        ...baseTableData.baseData,
        EntityClass: undefined,
        allowCreate: false
    }
};

const noEntityClassAllowUpdateErrorData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        ...baseTableData.baseData,
        EntityClass: undefined,
        allowCreate: false,
        allowRead: false
    }
};

const noEntityClassAllowDeleteErrorData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        ...baseTableData.baseData,
        EntityClass: undefined,
        allowCreate: false,
        allowRead: false,
        allowUpdate: false
    }
};

describe('generateBaseData', () => {
    test('should build the data', () => {
        expect(new TableDataBuilder(tableData).getResult().baseData.allowCreate()).toBe(false);
    });
    test('should have correct default search function', () => {
        const data: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;
        expect(new TableDataBuilder(tableData).getResult().baseData.searchString.toString()).toBe(defaultSearchFunction.toString());
        expect(() => new TableDataBuilder(tableData).getResult().baseData.searchString(data)).not.toThrowError();
    });
});

describe('validateInput', () => {
    test('should throw error for manually configured "select" action', () => {
        expect(() => new TableDataBuilder(selectErrorData))
            .toThrow(
                `The name "select" for a display column is reserved for the multi-select action functionality.
                Please choose a different name.`
            );
    });
    test('should throw error for required EntityClass', () => {
        expect(() => new TableDataBuilder(noEntityClassAllowCreateErrorData))
            .toThrow(
                `Missing required Input data "EntityClass".
                You can only omit this value if you can neither create, read, update or delete entities.`
            );

        expect(() => new TableDataBuilder(noEntityClassAllowReadErrorData))
            .toThrow(
                `Missing required Input data "EntityClass".
                You can only omit this value if you can neither create, read, update or delete entities.`
            );

        expect(() => new TableDataBuilder(noEntityClassAllowUpdateErrorData))
            .toThrow(
                `Missing required Input data "EntityClass".
                You can only omit this value if you can neither create, read, update or delete entities.`
            );

        expect(() => new TableDataBuilder(noEntityClassAllowDeleteErrorData))
            .toThrow(
                `Missing required Input data "EntityClass".
                You can only omit this value if you can neither create, read, update or delete entities.`
            );
    });
});