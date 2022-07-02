import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class'
import { CreateEntityDialogData } from './create-entity-dialog-data'
import { HttpClient } from '@angular/common/http';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from './create-dialog-data.builder';

export class CreateEntityDialogDataInternal<EntityType extends Entity> implements CreateEntityDialogData<EntityType> {
    entity: EntityType;
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>;
    createDialogData: CreateDialogDataInternal;

    constructor(
        entity: EntityType,
        EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
        createDialogData: CreateDialogDataInternal
    ) {
        this.entity = entity;
        this.EntityServiceClass = EntityServiceClass;
        this.createDialogData = createDialogData;
    }
}

export class CreateEntityDialogDataBuilder<EntityType extends Entity> {
    createDialogData: CreateEntityDialogDataInternal<EntityType>;
    private readonly dataInput: CreateEntityDialogData<EntityType>;

    constructor(data: CreateEntityDialogData<EntityType>) {
        // this.validateInput(data);
        this.dataInput = data;
        const createDialogData: CreateDialogDataInternal = new CreateDialogDataBuilder(data.createDialogData).createDialogData;
        this.createDialogData = new CreateEntityDialogDataInternal<EntityType>(
            data.entity,
            data.EntityServiceClass,
            createDialogData
        );
        return this;
    }
}