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
        if (this.data.editDialogData.editRequiresConfirmDialog === false) {
            return this.confirmEdit();
        }
        const dialogData: ConfirmDialogData = {
            // eslint-disable-next-line max-len
            text: this.data.editDialogData.confirmEditDialogData?.text ? this.data.editDialogData.confirmEditDialogData?.text : ['Do you really want to save all changes?'],
            type: 'default',
            // eslint-disable-next-line max-len
            confirmButtonLabel: this.data.editDialogData.confirmEditDialogData?.confirmButtonLabel ? this.data.editDialogData.confirmEditDialogData?.confirmButtonLabel : 'Confirm',
            // eslint-disable-next-line max-len
            cancelButtonLabel: this.data.editDialogData.confirmEditDialogData?.cancelButtonLabel ? this.data.editDialogData.confirmEditDialogData?.cancelButtonLabel : 'Cancel',
            title: this.data.editDialogData.confirmEditDialogData?.title ? this.data.editDialogData.confirmEditDialogData?.title : 'Edit',
            // eslint-disable-next-line max-len
            requireConfirmation: this.data.editDialogData.confirmEditDialogData?.requireConfirmation ? this.data.editDialogData.confirmEditDialogData?.requireConfirmation : false,
            // eslint-disable-next-line max-len
            confirmationText: this.data.editDialogData.confirmEditDialogData?.confirmationText ? this.data.editDialogData.confirmEditDialogData?.confirmationText : undefined,
        };
        const dialogref = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogref.afterClosed().subscribe((res: number) => {
            if (res === 1) {
                this.confirmEdit();
            }
        });
    }
    private confirmEdit(): void {
        this.entityService.update(this.data.entity, this.entityPriorChanges).then(() => this.dialogRef.close(1));
    }

    delete(): void {
        if (this.data.editDialogData.deleteRequiresConfirmDialog === false) {
            return this.confirmDelete();
        }
        const dialogData: ConfirmDialogData = {
            // eslint-disable-next-line max-len
            text: this.data.editDialogData.confirmDeleteDialogData?.text ? this.data.editDialogData.confirmDeleteDialogData?.text : ['Do you really want to delete this entity?'],
            type: 'delete',
            // eslint-disable-next-line max-len
            confirmButtonLabel: this.data.editDialogData.confirmDeleteDialogData?.confirmButtonLabel ? this.data.editDialogData.confirmDeleteDialogData?.confirmButtonLabel : 'Delete',
            // eslint-disable-next-line max-len
            cancelButtonLabel: this.data.editDialogData.confirmDeleteDialogData?.cancelButtonLabel ? this.data.editDialogData.confirmDeleteDialogData?.cancelButtonLabel : 'Cancel',
            // eslint-disable-next-line max-len
            title: this.data.editDialogData.confirmDeleteDialogData?.title ? this.data.editDialogData.confirmDeleteDialogData?.title : 'Delete',
            // eslint-disable-next-line max-len
            requireConfirmation: this.data.editDialogData.confirmDeleteDialogData?.requireConfirmation ? this.data.editDialogData.confirmDeleteDialogData?.requireConfirmation : false,
            // eslint-disable-next-line max-len
            confirmationText: this.data.editDialogData.confirmDeleteDialogData?.confirmationText ? this.data.editDialogData.confirmDeleteDialogData?.confirmationText : undefined,
        };
        const dialogref = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogref.afterClosed().subscribe((res: number) => {
            if (res === 1) {
                this.confirmDelete();
            }
        });
    }
    private confirmDelete(): void {
        this.entityService.delete(this.entityPriorChanges.id).then(() => this.dialogRef.close(2));
    }

    cancel(): void {
        EntityUtilities.resetChangesOnEntity(this.data.entity, this.entityPriorChanges);
        this.dialogRef.close(0);
    }
}