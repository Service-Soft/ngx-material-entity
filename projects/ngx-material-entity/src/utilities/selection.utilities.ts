import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

/**
 * Provides functionality around material selections inside of tables.
 */
export abstract class SelectionUtilities {

    /**
     * Checks if all items in the table have been selected.
     * This is needed to display the "masterToggle"-checkbox correctly.
     * @param selection - The selection to check.
     * @param dataSource - The dataSource of the selection.
     * @returns Whether or not all items in the table have been selected.
     */
    // eslint-disable-next-line typescript/no-explicit-any
    static isAllSelected(selection: SelectionModel<any>, dataSource: MatTableDataSource<any>): boolean {
        const numSelected: number = selection.selected.length;
        const numRows: number = dataSource.data.length;
        return numSelected === numRows;
    }

    /**
     * Toggles all items in the table.
     * @param selection - The selection to toggle.
     * @param dataSource - The dataSource of the selection.
     */
    // eslint-disable-next-line typescript/no-explicit-any
    static masterToggle(selection: SelectionModel<any>, dataSource: MatTableDataSource<any>): void {
        if (SelectionUtilities.isAllSelected(selection, dataSource)) {
            selection.clear();
        }
        else {
            dataSource.data.forEach(row => selection.select(row));
        }
    }

    /**
     * Removes all selected entries from the array.
     * @param selection - The selection containing the items to remove.
     * @param values - The values of the dataSource.
     * @param dataSource - The dataSource.
     */
    // eslint-disable-next-line typescript/no-explicit-any
    static remove(selection: SelectionModel<any>, values: any[], dataSource: MatTableDataSource<any>): void {
        selection.selected.forEach(s => {
            values.splice(values.indexOf(s), 1);
        });
        dataSource.data = values;
        selection.clear();
    }
}