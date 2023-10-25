import { BaseEntityType, EntityServiceClassNewable } from '../../../classes/entity.model';
import { CreateData } from '../table-data';

/**
 * The Definition of the Create Entity Data.
 */
export interface CreateEntityData<EntityType extends BaseEntityType<EntityType>> {
    /**
     * An empty entity that is used as the data model.
     */
    entity: EntityType,
    /**
     * The Entity Service class used for the create request.
     */
    EntityServiceClass: EntityServiceClassNewable<EntityType>,
    /**
     * The info of the generic create-dialog or page.
     */
    createData?: CreateData
}