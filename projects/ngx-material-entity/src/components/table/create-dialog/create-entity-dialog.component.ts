import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';
import { EntityUtilities } from '../../../classes/entity-utilities.class';
import { CreateEntityDialogData } from './create-entity-dialog-data';
import { ConfirmDialogData } from '../../confirm-dialog/confirm-dialog-data';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'ngx-mat-entity-create-dialog',
    templateUrl: './create-entity-dialog.component.html',
    styleUrls: ['./create-entity-dialog.component.scss']
})
export class NgxMatEntityCreateDialogComponent<EntityType extends Entity> implements OnInit {
    EntityUtilities = EntityUtilities;

    entityKeys!: (keyof EntityType)[];

    entityService!: EntityService<EntityType>;

    getWidth = EntityUtilities.getWidth;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: CreateEntityDialogData<EntityType>,
        public dialogRef: MatDialogRef<NgxMatEntityCreateDialogComponent<EntityType>>,
        private readonly injector: Injector,
        private readonly dialog: MatDialog
    ) { }

    ngOnInit(): void {
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
        if (this.data.createDialogData.createRequiresConfirmDialog === false) {
            return this.confirmCreate();
        }
        const dialogData: ConfirmDialogData = {
            // eslint-disable-next-line max-len
            text: this.data.createDialogData.confirmCreateDialogData?.text ? this.data.createDialogData.confirmCreateDialogData?.text : ['Do you really want to create this entity?'],
            type: 'default',
            // eslint-disable-next-line max-len
            confirmButtonLabel: this.data.createDialogData.confirmCreateDialogData?.confirmButtonLabel ? this.data.createDialogData.confirmCreateDialogData?.confirmButtonLabel : 'Create',
            // eslint-disable-next-line max-len
            cancelButtonLabel: this.data.createDialogData.confirmCreateDialogData?.cancelButtonLabel ? this.data.createDialogData.confirmCreateDialogData?.cancelButtonLabel : 'Cancel',
            // eslint-disable-next-line max-len
            title: this.data.createDialogData.confirmCreateDialogData?.title ? this.data.createDialogData.confirmCreateDialogData?.title : 'Create',
            // eslint-disable-next-line max-len
            requireConfirmation: this.data.createDialogData.confirmCreateDialogData?.requireConfirmation ? this.data.createDialogData.confirmCreateDialogData?.requireConfirmation : false,
            // eslint-disable-next-line max-len
            confirmationText: this.data.createDialogData.confirmCreateDialogData?.confirmationText ? this.data.createDialogData.confirmCreateDialogData?.confirmationText : undefined,
        };
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