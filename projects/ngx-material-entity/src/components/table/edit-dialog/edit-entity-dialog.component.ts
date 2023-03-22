import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseEntityType } from '../../../classes/entity.model';
import { LodashUtilities } from '../../../encapsulation/lodash.utilities';
import { EntityService } from '../../../services/entity.service';
import { EntityTab, EntityUtilities } from '../../../utilities/entity.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { EditEntityData } from './edit-entity-data';
import { EditEntityDataBuilder, EditEntityDataInternal } from './edit-entity.builder';

/**
 * The default dialog used to edit an existing entity based on the configuration passed in the MAT_DIALOG_DATA "inputData".
 * Used by the ngx-mat-entity-table.
 *
 * It offers a lot of customization options which can be found in "EditEntityDialogData".
 */
@Component({
    selector: 'ngx-mat-entity-edit-dialog',
    templateUrl: './edit-entity-dialog.component.html',
    styleUrls: ['./edit-entity-dialog.component.scss']
})
export class NgxMatEntityEditDialogComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {
    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    entityTabs!: EntityTab<EntityType>[];

    entityService!: EntityService<EntityType>;

    entityPriorChanges!: EntityType;

    data!: EditEntityDataInternal<EntityType>;

    isEntityValid: boolean = true;
    isEntityDirty: boolean = false;

    isReadOnly!: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly inputData: EditEntityData<EntityType>,
        public dialogRef: MatDialogRef<NgxMatEntityEditDialogComponent<EntityType>>,
        private readonly injector: Injector,
        private readonly dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.data = new EditEntityDataBuilder(this.inputData).getResult();
        this.entityPriorChanges = LodashUtilities.cloneDeep(this.data.entity);
        this.isReadOnly = !this.data.allowUpdate(this.entityPriorChanges);
        this.dialogRef.disableClose = true;
        this.entityTabs = EntityUtilities.getEntityTabs(this.data.entity, false, true);
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
    }

    /**
     * Checks if the entity has become invalid or dirty.
     */
    async checkEntity(): Promise<void> {
        this.isEntityValid = EntityUtilities.isEntityValid(this.data.entity, 'update');
        this.isEntityDirty = await EntityUtilities.isDirty(this.data.entity, this.entityPriorChanges);
    }

    /**
     * Tries to save the changes and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    edit(): void {
        if (this.isReadOnly || !this.isEntityValid || !this.isEntityDirty) {
            return;
        }
        if (!this.data.editData.editRequiresConfirmDialog) {
            this.confirmEdit();
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.editData.confirmEditDialogData)
            .withDefault('text', ['Do you really want to save all changes?'])
            .withDefault('confirmButtonLabel', 'Save')
            .withDefault('title', 'Edit')
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmEdit();
            }
        });
    }

    private confirmEdit(): void {
        void this.entityService.update(this.data.entity, this.entityPriorChanges).then(() => this.dialogRef.close(1));
    }

    /**
     * Tries to delete the entity and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    delete(): void {
        if (!this.data.editData.deleteRequiresConfirmDialog) {
            this.confirmDelete();
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.editData.confirmDeleteDialogData)
            .withDefault('text', ['Do you really want to delete this entity?'])
            .withDefault('type', 'delete')
            .withDefault('confirmButtonLabel', 'Delete')
            .withDefault('title', 'Delete')
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmDelete();
            }
        });
    }

    private confirmDelete(): void {
        void this.entityService.delete(this.entityPriorChanges).then(() => this.dialogRef.close(2));
    }

    /**
     * Reverts all changes made and closes the dialog.
     */
    cancel(): void {
        EntityUtilities.resetChangesOnEntity(this.data.entity, this.entityPriorChanges);
        this.dialogRef.close(0);
    }
}