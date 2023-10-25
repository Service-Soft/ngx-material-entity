import { BaseBuilder } from '../../../classes/base.builder';
import { BaseEntityType, EntityServiceClassNewable } from '../../../classes/entity.model';
import { defaultTrue } from '../../../functions/default-true.function';
import { NgxGlobalDefaultValues } from '../../../global-configuration-values';
import { EditDataBuilder, EditDataInternal } from './edit-data.builder';
import { EditEntityData } from './edit-entity-data';

/**
 * The internal EditEntityData. Requires all default values the user can leave out.
 */
export class EditEntityDataInternal<EntityType extends BaseEntityType<EntityType>> implements EditEntityData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    entity: EntityType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityServiceClass: EntityServiceClassNewable<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    editData: EditDataInternal<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowUpdate: (entity: EntityType) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowDelete: (entity: EntityType) => boolean;

    constructor(
        entity: EntityType,
        EntityServiceClass: EntityServiceClassNewable<EntityType>,
        editData: EditDataInternal<EntityType>,
        allowUpdate: (entity: EntityType) => boolean,
        allowDelete: (entity: EntityType) => boolean
    ) {
        this.entity = entity;
        this.EntityServiceClass = EntityServiceClass;
        this.editData = editData;
        this.allowDelete = allowDelete;
        this.allowUpdate = allowUpdate;
    }
}

/**
 * The Builder for the EditEntityData. Sets default values.
 */
export class EditEntityDataBuilder<EntityType extends BaseEntityType<EntityType>>
    extends BaseBuilder<EditEntityDataInternal<EntityType>, EditEntityData<EntityType>> {

    constructor(data: EditEntityData<EntityType>, globalConfig: NgxGlobalDefaultValues) {
        super(globalConfig, data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: EditEntityData<EntityType>): EditEntityDataInternal<EntityType> {
        const editDialogData: EditDataInternal<EntityType> = new EditDataBuilder(this.globalConfig, data.editData).getResult();
        return new EditEntityDataInternal<EntityType>(
            data.entity,
            data.EntityServiceClass,
            editDialogData,
            data.allowUpdate ?? defaultTrue,
            data.allowDelete ?? defaultTrue
        );
    }
}