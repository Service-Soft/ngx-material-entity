import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';
import { EntityUtilities } from '../../../classes/entity-utilities.class';
import { CreateEntityDialogData } from './create-entity-dialog-data';

@Component({
    selector: 'ngx-material-entity-create-dialog',
    templateUrl: './create-entity-dialog.component.html',
    styleUrls: ['./create-entity-dialog.component.scss']
})
export class CreateEntityDialogComponent<EntityType extends Entity> implements OnInit {

    EntityUtilities = EntityUtilities;

    entityKeys!: (keyof EntityType)[];

    entityService!: EntityService<EntityType>;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: CreateEntityDialogData<EntityType>,
        public dialogRef: MatDialogRef<CreateEntityDialogComponent<EntityType>>,
        private readonly injector: Injector
    ) {}

    ngOnInit(): void {
        this.dialogRef.disableClose = true;
        this.setEntityKeys();
        this.entityService = this.injector.get(this.data.EntityServiceClass);
    }

    private setEntityKeys() {
        this.entityKeys = Reflect.ownKeys(this.data.entity) as (keyof EntityType)[];
        const omitCreateKeys = EntityUtilities.getOmitForCreate(this.data.entity);
        this.entityKeys = this.entityKeys.filter(k => !omitCreateKeys.includes(k));
    }

    create() {
        this.entityService.create(this.data.entity).then(() => this.dialogRef.close());
    }

    cancel() {
        this.dialogRef.close();
    }
}