/* eslint-disable jsdoc/require-jsdoc */
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LodashUtilities } from '../../../capsulation/lodash.utilities';
import { EntityUtilities } from '../../../classes/entity.utilities';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { BaseEntityType } from '../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../base-input.component';
import { DecoratorTypes } from '../../../decorators/base/decorator-types.enum';
import { Component, OnInit } from '@angular/core';

type ArrayTableType = DecoratorTypes.ARRAY | DecoratorTypes.ARRAY_DATE
    | DecoratorTypes.ARRAY_DATE_RANGE | DecoratorTypes.ARRAY_DATE_TIME;

/**
 * The base data needed for all arrays that are displayed as a table.
 */
@Component({
    selector: 'ngx-mat-entity-array-table',
    template: ''
})
export abstract class ArrayTableComponent<T, EntityType extends BaseEntityType<EntityType>, ArrayType extends ArrayTableType>
    extends NgxMatEntityBaseInputComponent<EntityType, ArrayType> implements OnInit {

    arrayValues!: T[];
    input?: T = undefined;
    dataSource: MatTableDataSource<T> = new MatTableDataSource();
    selection: SelectionModel<T> = new SelectionModel<T>(true, []);
    displayedColumns!: string[];

    constructor(private readonly matDialog: MatDialog) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.entity[this.key] == null) {
            (this.entity[this.key] as T[]) = [];
        }
        this.arrayValues = this.entity[this.key] as T[];
        const givenDisplayColumns: string[] = this.metadata.displayColumns.map((v) => v.displayName);
        if (givenDisplayColumns.find(s => s === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved.
                Please choose a different name.`
            );
        }
        this.displayedColumns = this.isReadOnly ? givenDisplayColumns : ['select'].concat(givenDisplayColumns);
        this.dataSource.data = this.arrayValues;
    }

    /**
     * Toggles all array-items in the table.
     *
     */
    masterToggle(): void {
        if (this.isAllSelected()) {
            this.selection.clear();
        }
        else {
            this.dataSource.data.forEach(row => this.selection.select(row));
        }
    }

    /**
     * Checks if all array-items in the table have been selected.
     * This is needed to display the "masterToggle"-checkbox correctly.
     *
     * @returns Whether or not all array-items in the table have been selected.
     */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /**
     * Tries to add an item to the array.
     */
    add(): void {
        if (this.input != null) {
            if (
                !this.metadata.allowDuplicates
                && this.arrayValues.find(
                    async v => await EntityUtilities.isEqual(this.input, v, this.metadata, this.metadata.itemType)
                ) != null
            ) {
                this.matDialog.open(NgxMatEntityConfirmDialogComponent, {
                    data: this.metadata.duplicatesErrorDialog,
                    autoFocus: false,
                    restoreFocus: false
                });
                return;
            }
            this.arrayValues.push(LodashUtilities.cloneDeep(this.input));
            this.dataSource.data = this.arrayValues;
            this.resetInput();
            this.emitChange();
        }
    }

    /**
     * Is split up from the add method to override this functionality more easily.
     */
    protected resetInput(): void {
        this.input = undefined;
    }

    /**
     * Removes all selected entries from the entity array.
     */
    remove(): void {
        this.selection.selected.forEach(s => {
            this.arrayValues.splice(this.arrayValues.indexOf(s), 1);
        });
        this.dataSource.data = this.arrayValues;
        this.selection.clear();
        this.emitChange();
    }
}