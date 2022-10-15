import { TableData } from 'ngx-material-entity';
import { TestEntityService } from '../../../services/test-entity.service';
import { TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';

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
        EntityServiceClass: TestEntityService
    },
    createDialogData: {
        title: 'Create Test Entity'
    },
    editDialogData: {
        title: (entity: TestEntity) => `Test Entity #${entity.id}`
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
        multiSelectActions: [
            {
                displayName: 'Multi Action',
                // eslint-disable-next-line no-console
                action: () => console.log('ran multi action')
            }
        ],
        multiSelectLabel: 'Custom Multi Select Label'
    },
    createDialogData: {
        title: 'Create Test Entity'
    },
    editDialogData: {
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
        multiSelectActions: [
            {
                displayName: 'Multi Action',
                // eslint-disable-next-line no-console
                action: () => console.log('ran multi action')
            }
        ],
        multiSelectLabel: 'Custom Multi Select Label'
    },
    createDialogData: {
        title: 'Create Test Entity'
    },
    editDialogData: {
        title: (entity: TestEntity) => `Test Entity #${entity.id}`
    }
};