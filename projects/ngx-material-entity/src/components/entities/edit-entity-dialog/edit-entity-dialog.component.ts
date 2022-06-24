import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';
import { EntityUtilities } from '../../../classes/entity-utilities.class';
import { cloneDeep } from 'lodash';
import { EditEntityDialogData } from './edit-entity-dialog-data';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../../confirm-dialog/confirm-dialog-data';

@Component({
    selector: 'ngx-material-entity-edit-dialog',
    templateUrl: './edit-entity-dialog.component.html',
    styleUrls: ['./edit-entity-dialog.component.scss']
})
export class EditEntityDialogComponent<EntityType extends Entity> implements OnInit {
    EntityUtilities = EntityUtilities;

    entityKeys!: (keyof EntityType)[];

    entityService!: EntityService<EntityType>;

    entityPriorChanges!: EntityType;

    getWidth = EntityUtilities.getWidth;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: EditEntityDialogData<EntityType>,
        public dialogRef: MatDialogRef<EditEntityDialogComponent<EntityType>>,
        private readonly injector: Injector,
        private readonly dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.dialogRef.disableClose = true;
        this.setEntityKeys();
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
        this.entityPriorChanges = cloneDeep(this.data.entity);
    }

    private setEntityKeys(): void {
        this.entityKeys = Reflect.ownKeys(this.data.entity) as (keyof EntityType)[];
        const omitUpdateKeys = EntityUtilities.getOmitForUpdate(this.data.entity);
        this.entityKeys = this.entityKeys.filter((k) => !omitUpdateKeys.includes(k))
            .sort((a, b) => EntityUtilities.compareOrder(a, b, this.data.entity));
    }

    edit(): void {
        this.entityService.update(this.data.entity, this.entityPriorChanges).then(() => this.dialogRef.close());
    }

    delete(): void {
        const dialogData: ConfirmDialogData = {
            text: this.data.confirmDeleteText ? this.data.confirmDeleteText : ['Do you really want to delete this?'],
            type: 'delete',
            confirmButtonLabel: this.data.confirmDeleteButtonLabel ? this.data.confirmDeleteButtonLabel : 'Confirm',
            cancelButtonLabel: this.data.cancelDeleteButtonLabel ? this.data.cancelDeleteButtonLabel : 'Cancel',
            title: this.data.confirmDeleteDialogTitle ? this.data.confirmDeleteDialogTitle : 'Delete',
            requireConfirmation: this.data.confirmDeleteRequireConfirmation ? this.data.confirmDeleteRequireConfirmation : false,
            confirmationText: this.data.confirmDeleteConfirmationText ? this.data.confirmDeleteConfirmationText : undefined,
        };
        const dialogref = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData
        });
        dialogref.afterClosed().subscribe((res: number) => {
            if (res === 1) {
                this.confirmDelete();
            }
        });
    }
    private confirmDelete(): void {
        this.entityService.delete(this.entityPriorChanges.id).then(() => this.dialogRef.close());
    }

    cancel(): void {
        this.dialogRef.close();
    }
}