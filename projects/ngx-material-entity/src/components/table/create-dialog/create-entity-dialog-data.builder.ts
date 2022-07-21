import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class'
import { CreateEntityDialogData } from './create-entity-dialog-data'
import { HttpClient } from '@angular/common/http';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from './create-dialog-data.builder';
import { BaseBuilder } from '../../../classes/base-builder.class';

/**
 * The internal CreateEntityDialogData. Requires all default values the user can leave out.
 */
export class CreateEntityDialogDataInternal<EntityType extends Entity> implements CreateEntityDialogData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    entity: EntityType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
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

/**
 * The Builder for the CreateEntityDialogData. Sets default values.
 */
export class CreateEntityDialogDataBuilder<EntityType extends Entity>
    extends BaseBuilder<CreateEntityDialogDataInternal<EntityType>, CreateEntityDialogData<EntityType>> {

    constructor(data: CreateEntityDialogData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: CreateEntityDialogData<EntityType>): CreateEntityDialogDataInternal<EntityType> {
        const createDialogData: CreateDialogDataInternal = new CreateDialogDataBuilder(data.createDialogData).getResult();
        return new CreateEntityDialogDataInternal<EntityType>(
            data.entity,
            data.EntityServiceClass,
            createDialogData
        );
    }
}