import { HttpClient } from '@angular/common/http';
import { NgxGlobalDefaultValues } from '../../../global-configuration-values';
import { BaseBuilder } from '../../../classes/base.builder';
import { BaseEntityType } from '../../../classes/entity.model';
import { EntityService } from '../../../services/entity.service';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from './create-dialog-data.builder';
import { CreateEntityDialogData } from './create-entity-dialog-data';

/**
 * The internal CreateEntityDialogData. Requires all default values the user can leave out.
 */
export class CreateEntityDialogDataInternal<EntityType extends BaseEntityType<EntityType>> implements CreateEntityDialogData<EntityType> {
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
export class CreateEntityDialogDataBuilder<EntityType extends BaseEntityType<EntityType>>
    extends BaseBuilder<CreateEntityDialogDataInternal<EntityType>, CreateEntityDialogData<EntityType>> {

    constructor(data: CreateEntityDialogData<EntityType>, globalConfig: NgxGlobalDefaultValues) {
        super(globalConfig, data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: CreateEntityDialogData<EntityType>): CreateEntityDialogDataInternal<EntityType> {
        // eslint-disable-next-line max-len
        const createDialogData: CreateDialogDataInternal = new CreateDialogDataBuilder(this.globalConfig, data.createDialogData).getResult();
        return new CreateEntityDialogDataInternal<EntityType>(
            data.entity,
            data.EntityServiceClass,
            createDialogData
        );
    }
}