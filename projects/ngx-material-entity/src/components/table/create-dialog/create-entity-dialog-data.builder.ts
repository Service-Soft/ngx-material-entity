import { BaseBuilder } from '../../../classes/base.builder';
import { BaseEntityType, EntityServiceClassNewable } from '../../../classes/entity.model';
import { NgxGlobalDefaultValues } from '../../../global-configuration-values';
import { CreateDataBuilder, CreateDataInternal } from './create-data.builder';
import { CreateEntityData } from './create-entity-dialog-data';

/**
 * The internal CreateEntityDialogData. Requires all default values the user can leave out.
 */
export class CreateEntityDataInternal<EntityType extends BaseEntityType<EntityType>> implements CreateEntityData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    entity: EntityType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityServiceClass: EntityServiceClassNewable<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createData: CreateDataInternal;

    constructor(
        entity: EntityType,
        EntityServiceClass: EntityServiceClassNewable<EntityType>,
        createData: CreateDataInternal
    ) {
        this.entity = entity;
        this.EntityServiceClass = EntityServiceClass;
        this.createData = createData;
    }
}

/**
 * The Builder for the CreateEntityDialogData. Sets default values.
 */
export class CreateEntityDialogDataBuilder<EntityType extends BaseEntityType<EntityType>>
    extends BaseBuilder<CreateEntityDataInternal<EntityType>, CreateEntityData<EntityType>> {

    constructor(data: CreateEntityData<EntityType>, globalConfig: NgxGlobalDefaultValues) {
        super(globalConfig, data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: CreateEntityData<EntityType>): CreateEntityDataInternal<EntityType> {

        const createDialogData: CreateDataInternal = new CreateDataBuilder(this.globalConfig, data.createData).getResult();
        return new CreateEntityDataInternal<EntityType>(
            data.entity,
            data.EntityServiceClass,
            createDialogData
        );
    }
}