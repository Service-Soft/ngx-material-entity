import { Component } from '@angular/core';
import { EntityUtilities, TableData } from 'ngx-material-entity';
import { TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';
import { TestEntityService } from '../../../services/test-entity.service';
import { TableDataEntity } from './table-data.entity';

@Component({
    selector: 'app-showcase-table',
    templateUrl: './showcase-table.component.html',
    styleUrls: ['./showcase-table.component.scss']
})
// eslint-disable-next-line jsdoc/require-jsdoc
export class ShowcaseTableComponent {

    EntityUtilities = EntityUtilities;
    customTable: boolean = false;

    defaultTableData: TableData<TestEntity> = {
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
        },
        createDialogData: {
            title: 'Create Test Entity'
        },
        editDialogData: {
            title: (entity: TestEntity) => `Test Entity #${entity.id}`
        }
    }

    customTableData: TableData<TestEntity> = {
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
            allowEdit: () => false,
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
    }

    tableConfig: TableDataEntity<TestEntity> = new TableDataEntity(this.defaultTableData as TableDataEntity<TestEntity>);
    keys: (keyof TableDataEntity<TestEntity>)[] = EntityUtilities.keysOf(this.tableConfig);

    constructor() { }
}