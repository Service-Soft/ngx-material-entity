import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class'
import { HttpClient } from '@angular/common/http';
import { EditEntityDialogData } from './edit-entity-dialog-data';
import { EditDialogDataBuilder, EditDialogDataInternal } from './edit-dialog-data.builder';

export class EditEntityDialogDataInternal<EntityType extends Entity> implements EditEntityDialogData<EntityType> {
    entity: EntityType;
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>;
    editDialogData: EditDialogDataInternal<EntityType>;
    allowDelete: (entity: EntityType) => boolean;

    constructor(
        entity: EntityType,
        EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
        editDialogData: EditDialogDataInternal<EntityType>,
        allowDelete: (entity: EntityType) => boolean
    ) {
        this.entity = entity;
        this.EntityServiceClass = EntityServiceClass;
        this.editDialogData = editDialogData;
        this.allowDelete = allowDelete;
    }
}

export class EditEntityDialogDataBuilder<EntityType extends Entity> {
    editDialogData: EditEntityDialogDataInternal<EntityType>;
    private readonly dataInput: EditEntityDialogData<EntityType>;

    constructor(data: EditEntityDialogData<EntityType>) {
        // this.validateInput(data);
        this.dataInput = data;
        const editDialogData: EditDialogDataInternal<EntityType> = new EditDialogDataBuilder(data.editDialogData).editDialogData;
        this.editDialogData = new EditEntityDialogDataInternal<EntityType>(
            data.entity,
            data.EntityServiceClass,
            editDialogData,
            data.allowDelete ? data.allowDelete : () => true
        );
        return this;
    }
}