import { TableData, exportAsCsvMultiAction, exportAsJsonMultiAction, exportAsXmlMultiAction } from 'ngx-material-entity';
import { TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';
import { TestEntityService } from '../../../services/test-entity.service';

export const defaultTableData: TableData<TestEntity> = {
    baseData: {
        title: 'Default Test Entities',
        displayColumns: [
            {
                displayName: 'Max and Min Strings',
                value: (entity: TestEntity) => `${entity.maxLengthStringValue} ${entity.minLengthStringValue}`
            },
            {
                displayName: 'Object',
                value: (entity: TestEntity) => `#${entity.objectValue.id} ${entity.objectValue.maxLengthStringValue}`
            }
        ],
        EntityClass: TestEntity,
        EntityServiceClass: TestEntityService,
        defaultEdit: 'page'
    },
    createDialogData: {
        title: 'Create Test Entity'
    }
};

export const defaultTableDataDialog: TableData<TestEntity> = {
    baseData: {
        title: 'Default Test Entities',
        displayColumns: [
            {
                displayName: 'Max and Min Strings',
                value: (entity: TestEntity) => `${entity.maxLengthStringValue} ${entity.minLengthStringValue}`
            },
            {
                displayName: 'Object',
                value: (entity: TestEntity) => `#${entity.objectValue.id} ${entity.objectValue.maxLengthStringValue}`
            }
        ],
        EntityClass: TestEntity,
        EntityServiceClass: TestEntityService
    },
    createDialogData: {
        title: 'Create Test Entity'
    }
};

export const customTableData: TableData<TestEntity> = {
    baseData: {
        title: 'Test Entities',
        displayColumns: [
            {
                displayName: 'Max and Min Strings',
                value: (entity: TestEntity) => `${entity.maxLengthStringValue} ${entity.minLengthStringValue}`
            },
            {
                displayName: 'Object',
                value: (entity: TestEntity) => `#${entity.objectValue.id} ${entity.objectValue.maxLengthStringValue}`
            }
        ],
        EntityClass: TestEntity,
        EntityServiceClass: TestEntityService,
        searchLabel: 'Custom Search Label',
        createButtonLabel: 'Custom Create Button Label',
        searchString: () => 'x',
        allowRead: () => false,
        allowUpdate: () => false,
        allowDelete: () => false,
        tableActions: [
            {
                type: 'default',
                displayName: 'Default Action',
                // eslint-disable-next-line no-console
                action: () => console.log('ran table action')
            },
            {
                type: 'multi-select',
                displayName: 'Multi Action',
                // eslint-disable-next-line no-console
                action: () => console.log('ran multi action')
            },
            {
                type: 'multi-select',
                displayName: 'Export (JSON)',
                action: exportAsJsonMultiAction
            },
            {
                type: 'multi-select',
                displayName: 'Export (Xml)',
                action: exportAsXmlMultiAction
            },
            {
                type: 'multi-select',
                displayName: 'Export (CSV)',
                action: exportAsCsvMultiAction
            }
        ],
        tableActionsLabel: 'Custom Multi Select Label',
        allowJsonImport: true
    },
    createDialogData: {
        title: 'Create Test Entity'
    },
    editData: {
        title: (entity: TestEntity) => `Test Entity #${entity.id}`
    }
};

export const customTableDataReadOnly: TableData<TestEntity> = {
    baseData: {
        title: 'Test Entities',
        displayColumns: [
            {
                displayName: 'Max and Min Strings',
                value: (entity: TestEntity) => `${entity.maxLengthStringValue} ${entity.minLengthStringValue}`
            },
            {
                displayName: 'Object',
                value: (entity: TestEntity) => `#${entity.objectValue.id} ${entity.objectValue.maxLengthStringValue}`
            }
        ],
        EntityClass: TestEntity,
        EntityServiceClass: TestEntityService,
        searchLabel: 'Custom Search Label',
        createButtonLabel: 'Custom Create Button Label',
        searchString: () => 'x',
        allowUpdate: () => false,
        allowDelete: () => false,
        tableActions: [
            {
                type: 'default',
                displayName: 'Default Action',
                // eslint-disable-next-line no-console
                action: () => console.log('ran table action')
            },
            {
                type: 'multi-select',
                displayName: 'Multi Action',
                // eslint-disable-next-line no-console
                action: () => console.log('ran table action')
            }
        ],
        tableActionsLabel: 'Custom Multi Select Label'
    },
    createDialogData: {
        title: 'Create Test Entity'
    },
    editData: {
        title: (entity: TestEntity) => `Test Entity #${entity.id}`
    }
};