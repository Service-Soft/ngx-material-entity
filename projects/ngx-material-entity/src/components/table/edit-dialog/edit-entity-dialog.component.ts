import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityService } from '../../../classes/entity.service';
import { EntityRow, EntityUtilities } from '../../../classes/entity.utilities';
import { EditEntityDialogData } from './edit-entity-dialog-data';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { EditEntityDialogDataBuilder, EditEntityDialogDataInternal } from './edit-entity-dialog.builder';
import { LodashUtilities } from '../../../capsulation/lodash.utilities';
import { BaseEntityType } from '../../../classes/entity.model';

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
    EntityUtilities = EntityUtilities;

    entityRows!: EntityRow<EntityType>[];

    entityService!: EntityService<EntityType>;

    entityPriorChanges!: EntityType;

    data!: EditEntityDialogDataInternal<EntityType>;

    isEntityValid: boolean = true;
    isEntityDirty: Promise<boolean> = (async () => false).call(this);

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly inputData: EditEntityDialogData<EntityType>,
        public dialogRef: MatDialogRef<NgxMatEntityEditDialogComponent<EntityType>>,
        private readonly injector: Injector,
        private readonly dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.data = new EditEntityDialogDataBuilder(this.inputData).getResult();
        this.dialogRef.disableClose = true;
        this.entityRows = EntityUtilities.getEntityRows(this.data.entity, false, true);
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
        this.entityPriorChanges = LodashUtilities.cloneDeep(this.data.entity);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    checkEntity(): void {
        this.isEntityValid = EntityUtilities.isEntityValid(this.data.entity, 'update');
        this.isEntityDirty = EntityUtilities.dirty(this.data.entity, this.entityPriorChanges);
    }

    /**
     * Tries to save the changes and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    edit(): void {
        if (!this.data.editDialogData.editRequiresConfirmDialog) {
            this.confirmEdit();
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.editDialogData.confirmEditDialogData)
            .withDefault('text', ['Do you really want to save all changes?'])
            .withDefault('confirmButtonLabel', 'Save')
            .withDefault('title', 'Edit')
            .getResult();
        const dialogRef = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe((res: number) => {
            if (res === 1) {
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
        if (!this.data.editDialogData.deleteRequiresConfirmDialog) {
            this.confirmDelete();
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.editDialogData.confirmDeleteDialogData)
            .withDefault('text', ['Do you really want to delete this entity?'])
            .withDefault('type', 'delete')
            .withDefault('confirmButtonLabel', 'Delete')
            .withDefault('title', 'Delete')
            .getResult();
        const dialogRef = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe((res: number) => {
            if (res === 1) {
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