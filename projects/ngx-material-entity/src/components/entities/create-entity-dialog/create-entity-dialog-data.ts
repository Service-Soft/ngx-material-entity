import { HttpClient } from '@angular/common/http';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';

/**
 * The Definition of the Create Entity Dialog Data
 */
export interface CreateEntityDialogData<EntityType extends Entity> {
    /**
     * An empty entity that is used as the data model.
     */
    entity: EntityType,
    /**
     * The Entity Service class used for the create request.
     */
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
    /**
     * The title of the dialog.
     */
    title: string,
    /**
     * The label of the create-button.
     * Defaults to "Create".
     */
    createButtonLabel?: string,
    /**
     * The label of the cancel-button.
     * Defaults to "Cancel".
     */
    cancelButtonLabel?: string
}