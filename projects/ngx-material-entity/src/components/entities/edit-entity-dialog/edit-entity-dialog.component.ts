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

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: EditEntityDialogData<EntityType>,
        public dialogRef: MatDialogRef<EditEntityDialogComponent<EntityType>>,
        private readonly injector: Injector,
        private readonly dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.dialogRef.disableClose = true;
        this.setEntityKeys();
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
        this.entityPriorChanges = cloneDeep(this.data.entity);
    }

    private setEntityKeys(): void {
        this.entityKeys = Reflect.ownKeys(this.data.entity) as (keyof EntityType)[];
        const omitUpdateKeys = EntityUtilities.getOmitForUpdate(this.data.entity);
        this.entityKeys = this.entityKeys.filter((k) => !omitUpdateKeys.includes(k));
    }

    getWidth(key: keyof EntityType, type: 'lg' | 'md' | 'sm'): number {
        const propertyType = EntityUtilities.getPropertyType(this.data.entity, key);
        const metadata = EntityUtilities.getPropertyMetadata(this.data.entity, key, propertyType);
        if (metadata.defaultWidths) {
            switch (type) {
                case 'lg':
                    return metadata.defaultWidths[0];
                case 'md':
                    return metadata.defaultWidths[1];
                case 'sm':
                    return metadata.defaultWidths[2];
                default:
                    throw new Error('Something went wrong getting the width');
            }
        }
        else {
            throw new Error('Something went wrong getting the width');
        }
    }

    edit(): void {
        this.entityService.update(this.data.entity, this.entityPriorChanges).then(() => this.dialogRef.close());
    }

    //TODO Replace with @Input() parameters
    delete(): void {
        const dialogData: ConfirmDialogData = {
            text: ['Do you really want to delete this Account?'],
            type: 'delete',
            confirmButtonLabel: 'Bestätigen',
            cancelButtonLabel: 'Abbrechen',
            title: 'Bestätigen?',
            requireConfirmation: true,
            confirmationText: 'Das kann nicht rückgängig gemacht werden'
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