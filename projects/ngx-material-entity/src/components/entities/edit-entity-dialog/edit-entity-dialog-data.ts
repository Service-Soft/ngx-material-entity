import { HttpClient } from '@angular/common/http';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';

export interface EditEntityDialogData<EntityType extends Entity> {
    entity: EntityType;
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>;
    title: string;
    editButtonLabel?: string;
    cancelButtonLabel?: string;
    allowDelete?: boolean;
    deleteButtonLabel?: string;
}