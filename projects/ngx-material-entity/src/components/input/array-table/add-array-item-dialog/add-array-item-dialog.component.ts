import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Entity } from '../../../../classes/entity-model.class';
import { EntityRow, EntityUtilities } from '../../../../classes/entity-utilities.class';
import { AddArrayItemDialogData } from './add-array-item-dialog-data';
import { AddArrayItemDialogDataBuilder, AddArrayItemDialogDataInternal } from './add-array-item-dialog-data.builder';

@Component({
    selector: 'ngx-mat-entity-add-array-item-dialog',
    templateUrl: './add-array-item-dialog.component.html',
    styleUrls: ['./add-array-item-dialog.component.scss']
})
export class NgxMatEntityAddArrayItemDialogComponent<EntityType extends Entity> implements OnInit {
    EntityUtilities = EntityUtilities;

    entityRows!: EntityRow<EntityType>[];

    getWidth = EntityUtilities.getWidth;

    data!: AddArrayItemDialogDataInternal<EntityType>;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly inputData: AddArrayItemDialogData<EntityType>,
        public dialogRef: MatDialogRef<NgxMatEntityAddArrayItemDialogComponent<EntityType>>
    ) {}

    ngOnInit(): void {
        this.data = new AddArrayItemDialogDataBuilder(this.inputData).getResult();
        this.dialogRef.disableClose = true;
        this.entityRows = EntityUtilities.getEntityRows(this.data.entity, true);
    }

    /**
     * Closes the dialog with the value 1 to display that the item should be added.
     */
    create(): void {
        this.dialogRef.close(1);
    }

    /**
     * Closes the dialog.
     */
    cancel(): void {
        this.dialogRef.close();
    }
}