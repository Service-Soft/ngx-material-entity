import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EntityUtilities, NgxMatEntityTableComponent, TableData } from 'ngx-material-entity';

import { customTableData, customTableDataReadOnly, defaultTableData, defaultTableDataDialog } from './table-configs.data';
import { TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';

@Component({
    selector: 'app-showcase-table',
    templateUrl: './showcase-table.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSlideToggleModule,
        NgxMatEntityTableComponent
    ]
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
            case 'Custom': {
                return customTableData;
            }
            case 'Read Only': {
                return customTableDataReadOnly;
            }
            case 'Default Dialog': {
                return defaultTableDataDialog;
            }
            default: {
                return defaultTableData;
            }
        }
    }
}