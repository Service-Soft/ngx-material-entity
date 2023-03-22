import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseEntityType } from '../../../classes/entity.model';
import { EntityService } from '../../../services/entity.service';
import { EntityTab, EntityUtilities } from '../../../utilities/entity.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CreateEntityDialogData } from './create-entity-dialog-data';
import { CreateEntityDialogDataBuilder, CreateEntityDialogDataInternal } from './create-entity-dialog-data.builder';

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
export class NgxMatEntityCreateDialogComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {
    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    entityTabs!: EntityTab<EntityType>[];

    entityService!: EntityService<EntityType>;

    data!: CreateEntityDialogDataInternal<EntityType>;

    isEntityValid: boolean = false;

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
        this.entityTabs = EntityUtilities.getEntityTabs(this.data.entity, true);
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
    }

    /**
     * Checks if the entity is valid.
     */
    checkIsEntityValid(): void {
        this.isEntityValid = EntityUtilities.isEntityValid(this.data.entity, 'create');
    }

    /**
     * Tries add the new entity and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    create(): void {
        if (!this.isEntityValid) {
            return;
        }
        if (!this.data.createDialogData.createRequiresConfirmDialog) {
            this.confirmCreate();
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.createDialogData.confirmCreateDialogData)
            .withDefault('text', ['Do you really want to create this entity?'])
            .withDefault('confirmButtonLabel', 'Create')
            .withDefault('title', 'Create')
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmCreate();
            }
        });
    }
    private confirmCreate(): void {
        void this.entityService.create(this.data.entity).then(() => this.dialogRef.close());
    }

    /**
     * Closes the dialog.
     */
    cancel(): void {
        this.dialogRef.close();
    }
}