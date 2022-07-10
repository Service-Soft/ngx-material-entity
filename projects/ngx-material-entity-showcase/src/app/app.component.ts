import { Component } from '@angular/core';
import { TableData } from 'ngx-material-entity';
import { TestEntity } from '../../../ngx-material-entity/src/mocks/test-entity.mock';
import { TestEntityService } from '../services/test-entity.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

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
            EntityServiceClass: TestEntityService
        },
        createDialogData: {
            title: 'Create Test Entity'
        },
        editDialogData: {
            title: (entity: TestEntity) => `Test Entity #${entity.id}`
        }
    }

    constructor(private readonly personService: TestEntityService) {}
}