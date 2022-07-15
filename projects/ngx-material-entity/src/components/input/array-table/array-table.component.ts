import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { Entity } from '../../../classes/entity-model.class';
import { EntityRow, EntityUtilities } from '../../../classes/entity-utilities.class';
import { NgModel } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { NgxMatEntityAddArrayItemDialogComponent } from './add-array-item-dialog/add-array-item-dialog.component';
import { AddArrayItemDialogDataBuilder, AddArrayItemDialogDataInternal } from './add-array-item-dialog/add-array-item-dialog-data.builder';
import { AddArrayItemDialogData } from './add-array-item-dialog/add-array-item-dialog-data';
import { EntityArrayDecoratorConfigInternal } from '../../../decorators/array/array-decorator-internal.data';

@Component({
    selector: 'ngx-mat-entity-array-table',
    templateUrl: './array-table.component.html',
    styleUrls: ['./array-table.component.scss']
})
// eslint-disable-next-line jsdoc/require-jsdoc
export class NgxMatEntityArrayTableComponent<EntityType extends Entity> implements OnInit {
    /**
     * The items of the array to display inside the table.
     */
    @Input()
    arrayItems!: EntityType[];

    /**
     * The metadata of the EntityArray.
     */
    @Input()
    metadata!: EntityArrayDecoratorConfigInternal<EntityType>;

    /**
     * The function used for generating error messages.
     */
    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    /**
     * Whether to omit values that should be omitted for creation or values that should be omitted for updating.
     */
    @Input()
    omit!: 'create' | 'update';

    dataSource!: MatTableDataSource<EntityType>;

    selection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);

    displayedColumns!: string[];

    arrayItem!: EntityType;

    private arrayItemPriorChanges!: EntityType;

    rows!: EntityRow<EntityType>[];

    getWidth = EntityUtilities.getWidth;

    EntityUtilities = EntityUtilities;

    constructor(private readonly dialog: MatDialog) {}

    /**
     * This is needed for the inputs to work inside an ngFor.
     *
     * @param index - The index of the element in the ngFor.
     * @returns The index.
     */
    trackByFn(index: unknown): unknown {
        return index;
    }

    ngOnInit(): void {
        const givenDisplayColumns: string[] = this.metadata.displayColumns.map((v) => v.displayName);
        this.validateInput(givenDisplayColumns);
        this.displayedColumns = ['select'].concat(givenDisplayColumns);
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = this.arrayItems;
        this.arrayItem = new this.metadata.EntityClass();
        this.rows = EntityUtilities.getEntityRows(
            this.arrayItem,
            this.omit === 'create' ? true : false,
            this.omit === 'update' ? true : false
        );
        this.arrayItemPriorChanges = cloneDeep(this.arrayItem);
    }
    private validateInput(givenDisplayColumns: string[]): void {
        if (givenDisplayColumns.find((s) => s === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved.
                Please choose a different name.`
            );
        }
    }

    /**
     * Tries to add an item to the array.
     * Does this either inline if the "createInline"-metadata is set to true
     * or in a separate dialog if it is set to false.
     */
    add(): void {
        if (this.metadata.createInline) {
            this.arrayItems.push(cloneDeep(this.arrayItem));
            this.dataSource.data = this.arrayItems;
            EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
        }
        else {
            const dialogInputData: AddArrayItemDialogData<EntityType>= {
                entity: this.arrayItem,
                createDialogData: this.metadata.createDialogData,
                getValidationErrorMessage: this.getValidationErrorMessage
            }
            const dialogData: AddArrayItemDialogDataInternal<EntityType> = new AddArrayItemDialogDataBuilder(dialogInputData).getResult();
            firstValueFrom(
                this.dialog.open(
                    NgxMatEntityAddArrayItemDialogComponent,
                    {
                        data: dialogData,
                        autoFocus: false,
                        restoreFocus: false
                    }
                ).afterClosed()
            ).then((res: number) => {
                if (res === 1) {
                    this.arrayItems.push(cloneDeep(this.arrayItem));
                    this.dataSource.data = this.arrayItems;
                }
                EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
            });
        }
    }

    /**
     * Removes all selected entries from the array.
     */
    remove(): void {
        this.selection.selected.forEach(s => {
            this.arrayItems.splice(this.arrayItems.indexOf(s), 1);
        });
        this.dataSource.data = this.arrayItems;
        this.selection.clear();
    }

    /**
     * Toggles all array-items in the table.
     */
    masterToggle(): void {
        if (this.isAllSelected()) {
            this.selection.clear();
        }
        else {
            this.dataSource.data.forEach((row) => this.selection.select(row));
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
}