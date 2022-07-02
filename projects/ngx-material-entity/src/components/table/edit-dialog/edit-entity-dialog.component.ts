import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';
import { EntityUtilities } from '../../../classes/entity-utilities.class';
import { cloneDeep } from 'lodash';
import { EditEntityDialogData } from './edit-entity-dialog-data';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { EditEntityDialogDataBuilder, EditEntityDialogDataInternal } from './edit-entity-dialog.builder';

@Component({
    selector: 'ngx-mat-entity-edit-dialog',
    templateUrl: './edit-entity-dialog.component.html',
    styleUrls: ['./edit-entity-dialog.component.scss']
})
export class  NgxMatEntityEditDialogComponent<EntityType extends Entity> implements OnInit {
    EntityUtilities = EntityUtilities;

    entityKeys!: (keyof EntityType)[];

    entityService!: EntityService<EntityType>;

    entityPriorChanges!: EntityType;

    data!: EditEntityDialogDataInternal<EntityType>;

    getWidth = EntityUtilities.getWidth;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly inputData: EditEntityDialogData<EntityType>,
        public dialogRef: MatDialogRef<NgxMatEntityEditDialogComponent<EntityType>>,
        private readonly injector: Injector,
        private readonly dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.data = new EditEntityDialogDataBuilder(this.inputData).editDialogData;
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
        if (!this.data.editDialogData.editRequiresConfirmDialog) {
            return this.confirmEdit();
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.editDialogData.confirmEditDialogData)
            .withDefaultText(['Do you really want to save all changes?'])
            .withDefaultConfirmButtonLabel('Save')
            .withDefaultTitle('Edit')
            .confirmDialogData;
        const dialogref = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
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
        if (!this.data.editDialogData.deleteRequiresConfirmDialog) {
            return this.confirmDelete();
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.editDialogData.confirmDeleteDialogData)
            .withDefaultText(['Do you really want to delete this entity?'])
            .withDefaultType('delete')
            .withDefaultConfirmButtonLabel('Delete')
            .withDefaultTitle('Delete')
            .confirmDialogData;
        const dialogref = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
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