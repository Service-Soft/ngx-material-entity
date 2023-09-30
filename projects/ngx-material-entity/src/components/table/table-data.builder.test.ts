/* eslint-disable max-len */
/* eslint-disable no-console */
import { expect } from '@jest/globals';
import { defaultGlobalDefaults } from '../../default-global-configuration-values';
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

const editDataAndDefaultEditPageErrorData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        ...baseTableData.baseData,
        defaultEdit: 'page'
    },
    editData: {
        actionsLabel: 'Do'
    }
};

const actionsTableData: TableData<TestEntityWithoutCustomProperties> = {
    baseData: {
        ...baseTableData.baseData,
        tableActions: [
            {
                type: 'default',
                displayName: 'Default Action',
                action: async () => 42
            },
            {
                type: 'multi-select',
                displayName: 'Multi Select Action',
                action: entities => entities.length
            },
            {
                type: 'multi-select',
                displayName: 'Multi Select Action Async',
                action: async entities => entities.length
            }
        ]
    }
};

describe('generateBaseData', () => {
    test('should build the data', () => {
        expect(new TableDataBuilder(defaultGlobalDefaults, tableData).getResult().baseData.allowCreate()).toBe(false);
    });
    test('should have correct default search function', () => {
        const data: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;
        expect(new TableDataBuilder(defaultGlobalDefaults, tableData).getResult().baseData.searchString.toString()).toBe(defaultSearchFunction.toString());
        expect(() => new TableDataBuilder(defaultGlobalDefaults, tableData).getResult().baseData.searchString(data)).not.toThrowError();
    });
    test('should build the actions correctly', async () => {
        const tableData: TableDataInternal<TestEntityWithoutCustomProperties> = new TableDataBuilder(defaultGlobalDefaults, actionsTableData).getResult();
        expect(tableData.baseData.tableActions).toHaveLength(3);
        expect(tableData.baseData.tableActions[0]).toBeInstanceOf(BaseTableActionInternal);
        const action1Res: unknown = await tableData.baseData.tableActions[0].action([]);
        expect(action1Res).toBe(42);
        expect(tableData.baseData.tableActions[1]).toBeInstanceOf(MultiSelectActionInternal);
        const action2Res: unknown = await tableData.baseData.tableActions[1].action([{} as TestEntityWithoutCustomProperties]);
        expect(action2Res).toBe(1);
        expect(tableData.baseData.tableActions[2]).toBeInstanceOf(MultiSelectActionInternal);
        const action3Res: unknown = await tableData.baseData.tableActions[1].action([{} as TestEntityWithoutCustomProperties, {} as TestEntityWithoutCustomProperties]);
        expect(action3Res).toBe(2);
    });
});

describe('validateInput', () => {
    test('should throw error for manually configured "select" action', () => {
        expect(() => new TableDataBuilder(defaultGlobalDefaults, selectErrorData))
            .toThrow(
                `The name "select" for a display column is reserved for the multi-select action functionality.
                Please choose a different name.`
            );
    });
    test('should throw error for required EntityClass', () => {
        expect(() => new TableDataBuilder(defaultGlobalDefaults, noEntityClassAllowCreateErrorData))
            .toThrow(
                `Missing required Input data "EntityClass".
                You can only omit this value if you can neither create, read, update or delete entities.`
            );

        expect(() => new TableDataBuilder(defaultGlobalDefaults, noEntityClassAllowReadErrorData))
            .toThrow(
                `Missing required Input data "EntityClass".
                You can only omit this value if you can neither create, read, update or delete entities.`
            );

        expect(() => new TableDataBuilder(defaultGlobalDefaults, noEntityClassAllowUpdateErrorData))
            .toThrow(
                `Missing required Input data "EntityClass".
                You can only omit this value if you can neither create, read, update or delete entities.`
            );

        expect(() => new TableDataBuilder(defaultGlobalDefaults, noEntityClassAllowDeleteErrorData))
            .toThrow(
                `Missing required Input data "EntityClass".
                You can only omit this value if you can neither create, read, update or delete entities.`
            );
    });
    test('should throw error for provided edit data when default edit is page', () => {
        expect(() => new TableDataBuilder(defaultGlobalDefaults, editDataAndDefaultEditPageErrorData))
            .toThrow(
                `The configured edit data can't be used, as the entity gets edited on its own page.
                You need to provide values for the "NGX_EDIT_DATA", "NGX_EDIT_DATA_ENTITY" and "NGX_EDIT_DATA_ENTITY_SERVICE" injection keys
                on the route where the edit page is used.`
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
        }, defaultGlobalDefaults);
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
        }, defaultGlobalDefaults);
        expect(action.confirmDialogData).toEqual(expectedConfirmDialogData);
        expect(action.enabled([new TestEntityWithoutCustomPropertiesMockBuilder().testEntity])).toEqual(true);
        expect(action.enabled([])).toEqual(false);
        expect(action.requireConfirmDialog([new TestEntityWithoutCustomPropertiesMockBuilder().testEntity])).toEqual(false);
    });
});