import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';
import { EntityUtilities } from '../../../classes/entity-utilities.class';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { CreateEntityDialogDataBuilder, CreateEntityDialogDataInternal } from './create-entity-dialog-data.builder';
import { CreateEntityDialogData } from './create-entity-dialog-data';

@Component({
    selector: 'ngx-mat-entity-create-dialog',
    templateUrl: './create-entity-dialog.component.html',
    styleUrls: ['./create-entity-dialog.component.scss']
})
export class NgxMatEntityCreateDialogComponent<EntityType extends Entity> implements OnInit {
    EntityUtilities = EntityUtilities;

    entityKeys!: (keyof EntityType)[];

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
        this.data = new CreateEntityDialogDataBuilder(this.inputData).createDialogData;
        this.dialogRef.disableClose = true;
        this.setEntityKeys();
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
    }

    private setEntityKeys(): void {
        this.entityKeys = Reflect.ownKeys(this.data.entity) as (keyof EntityType)[];
        const omitCreateKeys = EntityUtilities.getOmitForCreate(this.data.entity);
        this.entityKeys = this.entityKeys.filter((k) => !omitCreateKeys.includes(k))
            .sort((a, b) => EntityUtilities.compareOrder(a, b, this.data.entity));
    }

    create(): void {
        if (!this.data.createDialogData?.createRequiresConfirmDialog) {
            return this.confirmCreate();
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.createDialogData?.confirmCreateDialogData)
            .withDefaultText(['Do you really want to create this entity?'])
            .withDefaultConfirmButtonLabel('Create')
            .withDefaultTitle('Create')
            .confirmDialogData;
        const dialogref = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogref.afterClosed().subscribe((res: number) => {
            if (res === 1) {
                this.confirmCreate();
            }
        });
    }
    private confirmCreate(): void {
        this.entityService.create(this.data.entity).then(() => this.dialogRef.close());
    }

    cancel(): void {
        this.dialogRef.close();
    }
}