import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';
import { EntityRow, EntityUtilities } from '../../../classes/entity-utilities.class';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { CreateEntityDialogDataBuilder, CreateEntityDialogDataInternal } from './create-entity-dialog-data.builder';
import { CreateEntityDialogData } from './create-entity-dialog-data';

/**
 * The default dialog used to create new entities based on the configuration passed in the MAT_DIALOG_DATA "inputData".
 * Used by the ngx-mat-entity-table.
 *
 * It offers a lot of customization options which can be found in "CreateEntityDialogData".
 */
@Component({
    selector: 'ngx-mat-entity-create-dialog',
    templateUrl: './create-entity-dialog.component.html',
    styleUrls: ['./create-entity-dialog.component.scss']
})
export class NgxMatEntityCreateDialogComponent<EntityType extends Entity> implements OnInit {
    EntityUtilities = EntityUtilities;

    entityRows!: EntityRow<EntityType>[];

    entityService!: EntityService<EntityType>;

    data!: CreateEntityDialogDataInternal<EntityType>;

    getWidth = EntityUtilities.getWidth;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly inputData: CreateEntityDialogData<EntityType>,
        public dialogRef: MatDialogRef<NgxMatEntityCreateDialogComponent<EntityType>>,
        private readonly injector: Injector,
        private readonly dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.data = new CreateEntityDialogDataBuilder(this.inputData).getResult();
        this.dialogRef.disableClose = true;
        this.entityRows = EntityUtilities.getEntityRows(this.data.entity, true);
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
    }

    /**
     * Tries add the new entity and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    create(): void {
        if (!this.data.createDialogData?.createRequiresConfirmDialog) {
            return this.confirmCreate();
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.createDialogData?.confirmCreateDialogData)
            .withDefault('text', ['Do you really want to create this entity?'])
            .withDefault('confirmButtonLabel', 'Create')
            .withDefault('title', 'Create')
            .getResult();
        const dialogRef = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe((res: number) => {
            if (res === 1) {
                this.confirmCreate();
            }
        });
    }
    private confirmCreate(): void {
        this.entityService.create(this.data.entity).then(() => this.dialogRef.close());
    }

    /**
     * Closes the dialog.
     */
    cancel(): void {
        this.dialogRef.close();
    }
}