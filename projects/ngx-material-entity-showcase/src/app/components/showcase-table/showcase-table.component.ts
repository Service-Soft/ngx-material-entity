import { Component } from '@angular/core';
import { TableData } from 'ngx-material-entity';
import { TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';
import { TestEntityService } from '../../../services/test-entity.service';

@Component({
    selector: 'app-showcase-table',
    templateUrl: './showcase-table.component.html',
    styleUrls: ['./showcase-table.component.scss']
})
// eslint-disable-next-line jsdoc/require-jsdoc
export class ShowcaseTableComponent {

    tableData: TableData<TestEntity> = {
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
        },
        createDialogData: {
            title: 'Create Test Entity'
        },
        editDialogData: {
            title: (entity: TestEntity) => `Test Entity #${entity.id}`
        }
    }

    constructor() { }
}