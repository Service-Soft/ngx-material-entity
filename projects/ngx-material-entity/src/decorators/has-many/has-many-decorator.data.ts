import { HttpClient } from '@angular/common/http';
import { BaseEntityType } from '../../classes/entity.model';
import { TableData } from '../../components/table/table-data';
import { EntityService } from '../../services/entity.service';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * Definition for the @hasMany metadata.
 */
export interface HasManyDecoratorConfig<
    EntityType extends BaseEntityType<EntityType>,
    RelatedBaseEntityType extends BaseEntityType<RelatedBaseEntityType>
> extends PropertyDecoratorConfig {
    /**
     * Whether or not the property gets omitted when creating new Entities.
     *
     * For the hasMany property this is always true, as entities can't be created for a non existing base entity.
     */
    omitForCreate?: true,
    /**
     * The configuration for the table with the hasMany entities.
     */
    tableData: TableData<EntityType>,
    /**
     * The service class for the base entity that the has hasMany entities belong to.
     * This is used to generate the create and read base urls, eg. "customers/{id}/invoices".
     * If you want to override that behavior you can provide a custom createBaseUrl and readBaseUrl function.
     */
    RelatedEntityServiceClass: new (httpClient: HttpClient) => EntityService<RelatedBaseEntityType>,
    /**
     * A function that generates a base url for create requests.
     *
     * @default `{baseEntityUrl}/{id}/{lastHasManyEntityUrlSegment}`
     */
    createBaseUrl?: (baseEntity: RelatedBaseEntityType, metadata: HasManyDecoratorConfig<EntityType, RelatedBaseEntityType>) => string,
    /**
     * A function that generates a base url for read requests.
     *
     * @default `{baseEntityUrl}/{id}/{lastHasManyEntityUrlSegment}`
     */
    readBaseUrl?: (baseEntity: RelatedBaseEntityType, metadata: HasManyDecoratorConfig<EntityType, RelatedBaseEntityType>) => string
}