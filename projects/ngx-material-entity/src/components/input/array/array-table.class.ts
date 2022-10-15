/* eslint-disable jsdoc/require-jsdoc */
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LodashUtilities } from '../../../encapsulation/lodash.utilities';
import { EntityUtilities } from '../../../classes/entity.utilities';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { BaseEntityType } from '../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../base-input.component';
import { DecoratorTypes } from '../../../decorators/base/decorator-types.enum';
import { Component, OnInit } from '@angular/core';
import { SelectionUtilities } from '../../../classes/selection.utilities';

type ArrayTableType = DecoratorTypes.ARRAY | DecoratorTypes.ARRAY_DATE
    | DecoratorTypes.ARRAY_DATE_RANGE | DecoratorTypes.ARRAY_DATE_TIME;

/**
 * The base component needed for all arrays that are displayed as a table.
 */
@Component({
    selector: 'ngx-mat-entity-array-table',
    template: ''
})
export abstract class ArrayTableComponent<ValueType, EntityType extends BaseEntityType<EntityType>, ArrayType extends ArrayTableType>
    extends NgxMatEntityBaseInputComponent<EntityType, ArrayType, ValueType[]> implements OnInit {

    input?: ValueType = undefined;
    dataSource: MatTableDataSource<ValueType> = new MatTableDataSource();
    selection: SelectionModel<ValueType> = new SelectionModel<ValueType>(true, []);
    displayedColumns!: string[];

    SelectionUtilities = SelectionUtilities;

    constructor(private readonly matDialog: MatDialog) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.propertyValue = this.propertyValue ?? [];
        const givenDisplayColumns: string[] = this.metadata.displayColumns.map((v) => v.displayName);
        if (givenDisplayColumns.find(s => s === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved.
                Please choose a different name.`
            );
        }
        this.displayedColumns = this.isReadOnly ? givenDisplayColumns : ['select'].concat(givenDisplayColumns);
        this.dataSource.data = this.propertyValue;
    }

    /**
     * Tries to add an item to the array.
     */
    add(): void {
        if (this.input != null) {
            if (
                !this.metadata.allowDuplicates
                && this.propertyValue?.find(
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
            this.propertyValue?.push(LodashUtilities.cloneDeep(this.input));
            this.dataSource.data = this.propertyValue ?? [];
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
        SelectionUtilities.remove(this.selection, this.propertyValue as [], this.dataSource);
        this.emitChange();
    }
}