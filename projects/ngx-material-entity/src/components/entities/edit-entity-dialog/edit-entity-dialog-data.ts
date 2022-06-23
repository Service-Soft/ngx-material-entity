import { HttpClient } from '@angular/common/http';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';

/**
 * The Definition of the Edit Entity Dialog Data
 */
export interface EditEntityDialogData<EntityType extends Entity> {
    /**
     * The entity to edit
     */
    entity: EntityType,
    /**
     * The Entity Service class used for updating/deleting the entity.
     */
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
    /**
     * The title of the dialog
     */
    title: string,
    /**
     * The label for the edit button.
     * Defaults to "Save".
     */
    editButtonLabel?: string,
    /**
     * The label for the cancel-button.
     * Defaults to "Cancel".
     */
    cancelButtonLabel?: string,
    /**
     * Whether or not the user should be able to delete the entity.
     * Defaults to true.
     */
    allowDelete?: boolean,
    /**
     * The label for the delete-button.
     * Defaults to "Delete".
     */
    deleteButtonLabel?: string
}