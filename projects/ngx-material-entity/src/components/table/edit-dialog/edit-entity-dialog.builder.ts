import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class'
import { HttpClient } from '@angular/common/http';
import { EditEntityDialogData } from './edit-entity-dialog-data';
import { EditDialogDataBuilder, EditDialogDataInternal } from './edit-dialog-data.builder';
import { BaseBuilder } from '../../../classes/base-builder.class';

/**
 * The internal EditEntityDialogData. Requires all default values the user can leave out.
 */
export class EditEntityDialogDataInternal<EntityType extends Entity> implements EditEntityDialogData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    entity: EntityType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    editDialogData: EditDialogDataInternal<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
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

/**
 * The Builder for the EditEntityDialogData. Sets default values.
 */
export class EditEntityDialogDataBuilder<EntityType extends Entity>
    extends BaseBuilder<EditEntityDialogDataInternal<EntityType>, EditEntityDialogData<EntityType>> {

    constructor(data: EditEntityDialogData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: EditEntityDialogData<EntityType>): EditEntityDialogDataInternal<EntityType> {
        const editDialogData: EditDialogDataInternal<EntityType> = new EditDialogDataBuilder(data.editDialogData).getResult();
        return new EditEntityDialogDataInternal<EntityType>(
            data.entity,
            data.EntityServiceClass,
            editDialogData,
            data.allowDelete ? data.allowDelete : () => true
        );
    }
}