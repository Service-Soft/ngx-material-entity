import { Component, Inject, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Entity } from '../../../../classes/entity-model.class';
import { EntityUtilities } from '../../../../classes/entity-utilities.class';
import { CreateDialogData } from '../../../entities/entities-data';

export interface CreateArrayItemDialogData<EntityType extends Entity> {
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
    selector: 'create-array-item-dialog',
    templateUrl: './create-array-item-dialog.component.html',
    styleUrls: ['./create-array-item-dialog.component.scss']
})
export class CreateArrayItemDialogComponent<EntityType extends Entity> implements OnInit {
    EntityUtilities = EntityUtilities;

    entityKeys!: (keyof EntityType)[];

    getWidth = EntityUtilities.getWidth;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: CreateArrayItemDialogData<EntityType>,
        public dialogRef: MatDialogRef<CreateArrayItemDialogComponent<EntityType>>
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