/* eslint-disable no-console */
import { expect } from '@jest/globals';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../../mocks/test-entity.interface';
import { TestEntityService } from '../../services/entity.service.test';
import { ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { TableData } from './table-data';
import { BaseTableActionInternal, MultiSelectActionInternal, TableDataBuilder, TableDataInternal, defaultSearchFunction } from './table-data.builder';

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
        tableActions: [
            {
                type: 'default',
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

const actionsTableData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        ...baseTableData.baseData,
        tableActions: [
            {
                type: 'default',
                displayName: 'Default Action',
                action: () => 42
            },
            {
                type: 'multi-select',
                displayName: 'Multi Select Action',
                action: entities => entities.length
            }
        ]
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
    test('should build the actions correctly', () => {
        const tableData: TableDataInternal<TestEntityWithoutCustomProperties> = new TableDataBuilder(actionsTableData).getResult();
        expect(tableData.baseData.tableActions).toHaveLength(2);
        expect(tableData.baseData.tableActions[0]).toBeInstanceOf(BaseTableActionInternal);
        expect(tableData.baseData.tableActions[1]).toBeInstanceOf(MultiSelectActionInternal);
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

describe('BaseTableAction', () => {
    test('should set the expected default values', () => {
        const expectedConfirmDialogData: ConfirmDialogDataInternal = {
            text: ['Do you really want to run this action?'],
            type: 'default',
            confirmButtonLabel: 'Confirm',
            cancelButtonLabel: 'Cancel',
            title: 'Confirmation',
            requireConfirmation: false
        };
        const action: BaseTableActionInternal = new BaseTableActionInternal({
            type: 'default',
            displayName: 'Test',
            action: () => 42
        });
        expect(action.confirmDialogData).toEqual(expectedConfirmDialogData);
        expect(action.enabled()).toEqual(true);
        expect(action.requireConfirmDialog()).toEqual(false);
    });
});

describe('MultiSelectActionInternal', () => {
    test('should set the expected default values', () => {
        const expectedConfirmDialogData: ConfirmDialogDataInternal = {
            text: ['Do you really want to run this action?'],
            type: 'default',
            confirmButtonLabel: 'Confirm',
            cancelButtonLabel: 'Cancel',
            title: 'Confirmation',
            requireConfirmation: false
        };
        const action: MultiSelectActionInternal<TestEntityWithoutCustomProperties> = new MultiSelectActionInternal({
            type: 'multi-select',
            displayName: 'Test',
            action: () => 42
        });
        expect(action.confirmDialogData).toEqual(expectedConfirmDialogData);
        expect(action.enabled([new TestEntityWithoutCustomPropertiesMockBuilder().testEntity])).toEqual(true);
        expect(action.enabled([])).toEqual(false);
        expect(action.requireConfirmDialog([new TestEntityWithoutCustomPropertiesMockBuilder().testEntity])).toEqual(false);
    });
});