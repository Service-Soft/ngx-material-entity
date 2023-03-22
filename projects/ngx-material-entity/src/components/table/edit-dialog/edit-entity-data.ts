import { HttpClient } from '@angular/common/http';
import { BaseEntityType } from '../../../classes/entity.model';
import { EntityService } from '../../../services/entity.service';
import { EditData } from '../table-data';

/**
 * The Definition of the Edit Entity Dialog or page Data.
 */
export interface EditEntityData<EntityType extends BaseEntityType<EntityType>> {
    /**
     * The entity to edit.
     */
    entity: EntityType,
    /**
     * The Entity Service class used for updating/deleting the entity.
     */
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
    /**
     * The info of the generic edit-dialog.
     */
    editData?: EditData<EntityType>,
    /**
     * Whether or not the user can delete this specific entity.
     */
    allowDelete?: (entity: EntityType) => boolean,
    /**
     * Whether or not the user can update this specific entity.
     */
    allowUpdate?: (entity: EntityType) => boolean
}