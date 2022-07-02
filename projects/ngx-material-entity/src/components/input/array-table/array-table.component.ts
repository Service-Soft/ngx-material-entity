import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { EntityArrayDecoratorConfig } from '../../../decorators/array.decorator';
import { Entity } from '../../../classes/entity-model.class';
import { EntityUtilities } from '../../../classes/entity-utilities.class';
import { NgModel } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { NgxMatEntityAddArrayItemDialogComponent } from './add-array-item-dialog/add-array-item-dialog.component';
import { AddArrayItemDialogDataBuilder, AddArrayItemDialogDataInternal } from './add-array-item-dialog/add-array-item-dialog-data.builder';
import { AddArrayItemDialogData } from './add-array-item-dialog/add-array-item-dialog-data';

@Component({
    selector: 'ngx-mat-entity-array-table',
    templateUrl: './array-table.component.html',
    styleUrls: ['./array-table.component.scss']
})
export class NgxMatEntityArrayTableComponent<EntityType extends Entity> implements OnInit {
    @Input()
    arrayItems!: EntityType[];

    @Input()
    metadata!: EntityArrayDecoratorConfig<EntityType>;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Input()
    omit!: 'create' | 'edit';

    dataSource!: MatTableDataSource<EntityType>;

    selection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);

    displayedColumns!: string[];

    arrayItem!: EntityType;

    private arrayItemPriorChanges!: EntityType;

    getWidth = EntityUtilities.getWidth;

    EntityUtilities = EntityUtilities;

    constructor(private readonly dialog: MatDialog) {}

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
        this.arrayItemPriorChanges = cloneDeep(this.arrayItem);
    }
    private validateInput(givenDisplayColumns: string[]): void {
        if (givenDisplayColumns.find((s) => s === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved.
                Please choose a different name.`
            );
        }
        if (!this.metadata.createInline && !this.metadata.createDialogData) {
            throw new Error(
                `Missing required Input data "createDialogData".
                You can only omit this value when the creation is inline.`
            );
        }
    }

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
            const dialogData: AddArrayItemDialogDataInternal<EntityType> = new AddArrayItemDialogDataBuilder(dialogInputData)
                .addArrayItemDialogData;
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
    remove(): void {
        this.selection.selected.forEach(s => {
            this.arrayItems.splice(this.arrayItems.indexOf(s), 1);
        });
        this.dataSource.data = this.arrayItems;
        this.selection.clear();
    }

    getObjectProperties(): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const property in this.arrayItem) {
            const metadata = EntityUtilities.getPropertyMetadata(
                this.arrayItem,
                property as keyof Entity,
                EntityUtilities.getPropertyType(this.arrayItem, property as keyof Entity)
            );
            if (!(metadata.omitForCreate)) {
                res.push(property as keyof Entity);
            }
        }
        return res.sort((a, b) => EntityUtilities.compareOrder(a, b, this.arrayItem));
    }

    masterToggle(): void {
        if (this.isAllSelected()) {
            this.selection.clear();
        }
        else {
            this.dataSource.data.forEach((row) => this.selection.select(row));
        }
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
}