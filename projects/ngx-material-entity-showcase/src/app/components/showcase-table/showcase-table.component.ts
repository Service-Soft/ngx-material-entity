/* eslint-disable jsdoc/require-jsdoc */
import { Component } from '@angular/core';
import { EntityUtilities, TableData } from 'ngx-material-entity';
import { TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';
import { customTableData, customTableDataReadOnly, defaultTableData, defaultTableDataDialog } from './table-configs.data';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({

    selector: 'app-showcase-table',
    templateUrl: './showcase-table.component.html',
    styleUrls: ['./showcase-table.component.scss']
})
export class ShowcaseTableComponent {

    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    tableDataPresets: string[] = ['Default', 'Default Dialog', 'Custom', 'Read Only'];
    selectedTableDataPreset: string = 'Default';
    tableData: TableData<TestEntity> = defaultTableData;
    // tableConfig: TableDataEntity<TestEntity> = new TableDataEntity(defaultTableData as TableDataEntity<TestEntity>);
    // keys: (keyof TableDataEntity<TestEntity>)[] = EntityUtilities.keysOf(this.tableConfig);
    showTable: boolean = true;

    refreshTable(): void {
        this.showTable = false;
        this.tableData = this.getTableData();
        setTimeout(() => this.showTable = true, 100);
    }

    private getTableData(): TableData<TestEntity> {
        switch (this.selectedTableDataPreset) {
            case 'Custom':
                return customTableData;
            case 'Read Only':
                return customTableDataReadOnly;
            case 'Default Dialog':
                return defaultTableDataDialog;
            default:
                return defaultTableData;
        }
    }
}