import { Component, Inject, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Entity } from '../../../../classes/entity-model.class';
import { EntityUtilities } from '../../../../classes/entity-utilities.class';
import { CreateDialogData } from '../../../table/table-data';

export interface AddArrayItemDialogData<EntityType extends Entity> {
    /**
     * An empty entity that is used as the data model.
     */
    entity: EntityType,
    /**
     * The info of the generic create-dialog.
     */
    createDialogData: CreateDialogData,
    /**
     * (optional) A custom function to generate the error-message for invalid inputs.
     */
    getValidationErrorMessage: (model: NgModel) => string
}

@Component({
    selector: 'ngx-mat-entity-add-array-item-dialog',
    templateUrl: './add-array-item-dialog.component.html',
    styleUrls: ['./add-array-item-dialog.component.scss']
})
export class NgxMatEntityAddArrayItemDialogComponent<EntityType extends Entity> implements OnInit {
    EntityUtilities = EntityUtilities;

    entityKeys!: (keyof EntityType)[];

    getWidth = EntityUtilities.getWidth;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: AddArrayItemDialogData<EntityType>,
        public dialogRef: MatDialogRef<NgxMatEntityAddArrayItemDialogComponent<EntityType>>
    ) { }

    ngOnInit(): void {
        this.dialogRef.disableClose = true;
        this.setEntityKeys();
    }

    private setEntityKeys(): void {
        this.entityKeys = Reflect.ownKeys(this.data.entity) as (keyof EntityType)[];
        const omitCreateKeys = EntityUtilities.getOmitForCreate(this.data.entity);
        this.entityKeys = this.entityKeys.filter((k) => !omitCreateKeys.includes(k))
            .sort((a, b) => EntityUtilities.compareOrder(a, b, this.data.entity));
    }

    create(): void {
        this.dialogRef.close(1);
    }

    cancel(): void {
        this.dialogRef.close();
    }
}