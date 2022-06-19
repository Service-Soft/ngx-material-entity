import { HttpClient } from '@angular/common/http';
import { EntityService } from '../../../classes/entity-service.class';
import { Entity } from '../../../classes/entity-model.class';

export interface CreateEntityDialogData<EntityType extends Entity> {
    entity: EntityType;
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>;
    title: string;
    createButtonLabel?: string;
    cancelButtonLabel?: string;
}