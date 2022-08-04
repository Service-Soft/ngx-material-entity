import { HttpClient } from '@angular/common/http';
import { EntityService } from '../../../classes/entity.service';
import { EditDialogData } from '../table-data';

/**
 * The Definition of the Edit Entity Dialog Data.
 */
export interface EditEntityDialogData<EntityType extends object> {
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
    editDialogData?: EditDialogData<EntityType>,
    /**
     * Whether or not the user can delete this specific entity.
     */
    allowDelete?: (entity: EntityType) => boolean
}