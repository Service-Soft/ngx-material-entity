import { HttpClient } from '@angular/common/http';
import { EntityService } from '../../../classes/entity.service';
import { CreateDialogData } from '../table-data';

/**
 * The Definition of the Create Entity Dialog Data.
 */
export interface CreateEntityDialogData<EntityType extends object> {
    /**
     * An empty entity that is used as the data model.
     */
    entity: EntityType,
    /**
     * The Entity Service class used for the create request.
     */
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
    /**
     * The info of the generic create-dialog.
     */
    createDialogData?: CreateDialogData
}